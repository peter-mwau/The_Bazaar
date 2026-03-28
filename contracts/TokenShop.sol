// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
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
    error TokenShop__MissingPriceFeed();
    error TokenShop__CouldNotWithdraw();

    constructor(address tokenAddress) {
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
        ,
        uint256 timeStamp,
        uint80 answeredInRound
    ) = i_priceFeed.latestRoundData();
    
    // Check for stale data
    require(price > 0, "Invalid price");
    require(answeredInRound >= roundID, "Stale price");
    require(timeStamp > 0, "Round not complete");
    
    return price;
}

    function amountToMint(uint256 amountInETH) public view returns (uint256) {
        uint256 ethUsdPrice = uint256(getChainlinkDataFeedLatestAnswer());
        uint8 feedDecimals = i_priceFeed.decimals();

        // Convert wei to USD with 18 decimals.
        uint256 usdValueWith18Decimals = (amountInETH * ethUsdPrice) / (10 ** feedDecimals);

        // Mint amount in token base units (18 decimals).
        return (usdValueWith18Decimals * (10 ** TOKEN_DECIMALS)) / TOKEN_USD_PRICE;
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
        require(amountIn > 0, "Amount must be greater than zero");

        // Transfer tokenIn from user
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        
        // Get prices from Chainlink
        uint256 priceIn = getPrice(tokenIn);
        uint256 priceOut = getPrice(tokenOut);

        uint8 tokenInDecimals = IERC20Metadata(tokenIn).decimals();
        uint8 tokenOutDecimals = IERC20Metadata(tokenOut).decimals();
        
        // Decimal-safe quote: amountOut keeps tokenOut's native decimals.
        uint256 amountOut =
            (amountIn * priceIn * (10 ** tokenOutDecimals)) /
            (priceOut * (10 ** tokenInDecimals));
        
        // Transfer tokenOut to user
        IERC20(tokenOut).transfer(msg.sender, amountOut);
        
        return amountOut;
    }

    function getPrice(address token) public view returns (uint256) {
        AggregatorV3Interface feed = tokenPriceFeeds[token];
        if (address(feed) == address(0)) revert TokenShop__MissingPriceFeed();

        (, int256 answer, , uint256 updatedAt, ) = feed.latestRoundData();
        if (answer <= 0) revert TokenShop__InvalidPrice();
        if (updatedAt == 0) revert TokenShop__StalePrice();

        uint8 feedDecimals = feed.decimals();
        return uint256(answer) * (10 ** (18 - feedDecimals));
    }
}