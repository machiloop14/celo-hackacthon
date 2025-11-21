const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarket", function () {
  let predictionMarket;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    predictionMarket = await PredictionMarket.deploy();
    await predictionMarket.deployed();
  });

  describe("Market Creation", function () {
    it("Should create a new market", async function () {
      const tx = await predictionMarket
        .connect(addr1)
        .createMarket("Will there be an electrical fault today?", 1);
      await tx.wait();

      const market = await predictionMarket.getMarket(1);
      expect(market.question).to.equal("Will there be an electrical fault today?");
      expect(market.creator).to.equal(addr1.address);
    });

    it("Should reject empty question", async function () {
      await expect(
        predictionMarket.connect(addr1).createMarket("", 1)
      ).to.be.revertedWith("Question cannot be empty");
    });
  });

  describe("Placing Bets", function () {
    beforeEach(async function () {
      await predictionMarket
        .connect(addr1)
        .createMarket("Test question", 1);
    });

    it("Should allow placing a YES bet", async function () {
      await expect(
        predictionMarket.connect(addr2).placeBet(1, true, {
          value: ethers.utils.parseEther("1.0"),
        })
      ).to.emit(predictionMarket, "BetPlaced");

      const userBet = await predictionMarket.getUserBet(1, addr2.address);
      expect(userBet.yesBet).to.equal(ethers.utils.parseEther("1.0"));
    });

    it("Should allow placing a NO bet", async function () {
      await expect(
        predictionMarket.connect(addr2).placeBet(1, false, {
          value: ethers.utils.parseEther("0.5"),
        })
      ).to.emit(predictionMarket, "BetPlaced");

      const userBet = await predictionMarket.getUserBet(1, addr2.address);
      expect(userBet.noBet).to.equal(ethers.utils.parseEther("0.5"));
    });
  });
});




