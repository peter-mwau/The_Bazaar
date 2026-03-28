// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {MyToken} from "./Token.sol";

contract TokenShop is Ownable {

    AggregatorV3Interface internal immutable i_priceFeed;
    MyToken public immutable i_token;

    mapping(address => AggregatorV3Interface) public tokenPriceFeeds;

    uint256 public constant TOKEN_DECIMALS = 18;
    uint256 public constant TOKEN_USD_PRICE = 2 * 10 ** TOKEN_DECIMALS; // 2 USD with 18 decimals

    event BalanceWithdrawn();
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);

    error TokenShop__StalePrice();
    error TokenShop__InvalidPrice();
    error TokenShop__ZeroETHSent();
    error TokenShop__CouldNotWithdraw();

    constructor(address tokenAddress) Ownable(msg.sender) {
        i_token = MyToken(tokenAddress);
        /**
        * Network: Sepolia
        * Aggregator: ETH/USD
        * Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306
        */
        i_priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    }

    /**
    * Returns the latest answer
    */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
    (
        uint80 roundID,
        int price,
        uint startedAt,
        uint timeStamp,
        uint80 answeredInRound
    ) = i_priceFeed.latestRoundData();
    
    // Check for stale data
    require(price > 0, "Invalid price");
    require(answeredInRound >= roundID, "Stale price");
    require(timeStamp > 0, "Round not complete");
    
    return price;
}

    function amountToMint(uint256 amountInETH) public view returns (uint256) {
        // Chainlink ETH/USD price has 8 decimals
        uint256 ethUsdPrice = uint256(getChainlinkDataFeedLatestAnswer());
    
        // Convert ETH amount to USD (ETH amount has 18 decimals, price has 8 decimals)
        // Result will have 26 decimals, we need to adjust
        uint256 ethAmountInUSD = (amountInETH * ethUsdPrice) / 10**18;
    
        // Calculate tokens to mint (each token = $2 with 18 decimals)
        // ethAmountInUSD has 8 decimals (from price), TOKEN_USD_PRICE has 18 decimals
        // Result will have (8 + 18 - 18) = 8 decimals, then we multiply by 10**10 to get 18 decimals
        return (ethAmountInUSD * 10**TOKEN_DECIMALS) / TOKEN_USD_PRICE;
    }

    receive() external payable {
        if (msg.value == 0) revert TokenShop__ZeroETHSent();
    
        uint256 tokenAmount = amountToMint(msg.value);
        require(tokenAmount > 0, "Token amount too small");
    
        i_token.mintToken(msg.sender, tokenAmount);

        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        if (!success) {
            revert TokenShop__CouldNotWithdraw();
        }
        emit BalanceWithdrawn();
    }

        function addTokenPriceFeed(address token, address feed) external onlyOwner {
        tokenPriceFeeds[token] = AggregatorV3Interface(feed);
    }

    function swapTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external returns (uint256) {
        // Transfer tokenIn from user
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        
        // Get prices from Chainlink
        uint256 priceIn = getPrice(tokenIn);
        uint256 priceOut = getPrice(tokenOut);
        
        // Calculate amountOut based on prices
        uint256 amountOut = (amountIn * priceIn) / priceOut;
        
        // Transfer tokenOut to user
        IERC20(tokenOut).transfer(msg.sender, amountOut);
        
        return amountOut;
    }
}