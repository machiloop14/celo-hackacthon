// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PredictionMarket {
    struct Market {
        uint256 id;
        string question;
        uint256 endTime;
        bool resolved;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 totalStaked;
        address creator;
        mapping(address => uint256) yesBets;
        mapping(address => uint256) noBets;
        mapping(address => bool) hasClaimed;
    }

    mapping(uint256 => Market) public markets;
    uint256 public marketCount;
    uint256 public feePercentage = 2; // 2% fee
    address public owner;

    event MarketCreated(
        uint256 indexed marketId,
        string question,
        uint256 endTime,
        address creator
    );
    
    event BetPlaced(
        uint256 indexed marketId,
        address indexed bettor,
        bool side,
        uint256 amount
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        bool outcome
    );
    
    event WinningsClaimed(
        uint256 indexed marketId,
        address indexed winner,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier validMarket(uint256 _marketId) {
        require(_marketId > 0 && _marketId <= marketCount, "Invalid market");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createMarket(
        string memory _question,
        uint256 _durationInDays
    ) external returns (uint256) {
        require(bytes(_question).length > 0, "Question cannot be empty");
        require(_durationInDays > 0 && _durationInDays <= 365, "Invalid duration");

        marketCount++;
        uint256 marketId = marketCount;
        Market storage market = markets[marketId];
        
        market.id = marketId;
        market.question = _question;
        market.endTime = block.timestamp + (_durationInDays * 1 days);
        market.creator = msg.sender;

        emit MarketCreated(marketId, _question, market.endTime, msg.sender);
        return marketId;
    }

    function placeBet(uint256 _marketId, bool _side) external payable validMarket(_marketId) {
        Market storage market = markets[_marketId];
        require(block.timestamp < market.endTime, "Market closed");
        require(!market.resolved, "Market already resolved");
        require(msg.value > 0, "Must bet something");

        if (_side) {
            market.yesBets[msg.sender] += msg.value;
            market.yesVotes += msg.value;
        } else {
            market.noBets[msg.sender] += msg.value;
            market.noVotes += msg.value;
        }

        market.totalStaked += msg.value;
        emit BetPlaced(_marketId, msg.sender, _side, msg.value);
    }

    function resolveMarket(uint256 _marketId, bool _outcome) external validMarket(_marketId) {
        Market storage market = markets[_marketId];
        require(block.timestamp >= market.endTime, "Market not ended");
        require(!market.resolved, "Already resolved");
        require(
            msg.sender == market.creator || msg.sender == owner,
            "Not authorized"
        );

        market.resolved = true;
        emit MarketResolved(_marketId, _outcome);
    }

    function claimWinnings(uint256 _marketId) external validMarket(_marketId) {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved");
        require(!market.hasClaimed[msg.sender], "Already claimed");

        bool outcome = market.yesVotes > market.noVotes;
        uint256 userBet;
        uint256 totalWinningSide;

        if (outcome) {
            userBet = market.yesBets[msg.sender];
            totalWinningSide = market.yesVotes;
        } else {
            userBet = market.noBets[msg.sender];
            totalWinningSide = market.noVotes;
        }

        require(userBet > 0, "No winning bet");
        require(totalWinningSide > 0, "No winners");

        market.hasClaimed[msg.sender] = true;

        // Calculate winnings: proportional share of total pool minus fee
        uint256 totalPool = market.totalStaked;
        uint256 fee = (totalPool * feePercentage) / 100;
        uint256 winningsPool = totalPool - fee;
        uint256 winnings = (winningsPool * userBet) / totalWinningSide;

        (bool success, ) = payable(msg.sender).call{value: winnings}("");
        require(success, "Transfer failed");

        emit WinningsClaimed(_marketId, msg.sender, winnings);
    }

    function getMarket(uint256 _marketId)
        external
        view
        validMarket(_marketId)
        returns (
            uint256 id,
            string memory question,
            uint256 endTime,
            bool resolved,
            uint256 yesVotes,
            uint256 noVotes,
            uint256 totalStaked,
            address creator
        )
    {
        Market storage market = markets[_marketId];
        return (
            market.id,
            market.question,
            market.endTime,
            market.resolved,
            market.yesVotes,
            market.noVotes,
            market.totalStaked,
            market.creator
        );
    }

    function getUserBet(uint256 _marketId, address _user)
        external
        view
        validMarket(_marketId)
        returns (uint256 yesBet, uint256 noBet)
    {
        Market storage market = markets[_marketId];
        return (market.yesBets[_user], market.noBets[_user]);
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Transfer failed");
    }

    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 10, "Fee too high");
        feePercentage = _feePercentage;
    }
}




