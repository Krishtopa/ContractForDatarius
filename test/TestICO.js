const DAT = artifacts.require("DAT.sol");
const DatariusICO = artifacts.require("DatariusICO.sol");


const timeTravel = function(time) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [time], // 86400 is num seconds in day
      id: new Date().getTime()
    }, (err, result) => {
      if (err) {
        return reject(err)
      }
      return resolve(result)
    });
  })
}

contract('DatariusICO', function(accounts) {
  function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
  };

  var ContractAddress;

  it("should set rate correctly", function() {

    var random_int = randomInteger(1, 1000);

    return DatariusICO.deployed().then(
      function(instance) {
        ContractAddress = instance;
        return ContractAddress.setRate(random_int, {
          from: accounts[3]
        });
    }).then(function(tx) {
      return ContractAddress.Rate_Eth.call();;
    }).then(function(rate) {
      assert.equal(rate, random_int, "Rate_Eth isn't correct");
    });

  });

  it("shouldn't send tokens, when investor sends ether to contract", function() {

    var flag = 0;
    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.sendTransaction({
        from: accounts[3],
        value: 4000000000000000000
      });
    }).then(function() {
      flag = 1;
    }).catch(function(e) {
      assert(true, "shouldn't send tokens when ico isn't started");
    }).then(function() {
      if(flag) {
        assert(false, "shouldn't send tokens when ico isn't started");
      }
    });
  });

  it("shouldn't buy tokens for investor who pdat in other cryptos", function() {
    var random_int = randomInteger(100000, 10000000);
    var flag = 0;

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.buyForInvestor(accounts[1], random_int, "txH", {
        from: accounts[4]
      })
    }).then(function() {
      flag = 1;
    }).catch(function(e) {
      assert(true, "shouldn't buy tokens for investor when ico isn't started");
    }).then(function() {
      if(flag) {
        assert(false, "shouldn't send tokens when ico isn't started");
      }
    });
  });


  it("should start preICO", function() {
    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.startPreIco({
        from: accounts[3]
      });
    }).then(function(tx) {
      console.log("This is receipt: " + tx.receipt);
      assert.notEqual(tx.receipt.logs.length, 0, "preICO wasn't started");
    }).catch(function(e) {
      console.log("preICO wasn't started");
      console.log(e);
      assert(false, "preICO wasn't started");
    });
  });

  it("should send tokens, when investor sends ether to contract", function() {

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.sendTransaction({
        from: accounts[0],
        value: 4000000000000000000
      });
    }).then(function() {
      return ContractAddress.dat.call();
    }).then(function(token) {
      dat = DAT.at(token);
      return dat.balanceOf.call(accounts[0]);
    }).then(function(result) {
      console.log(result + " current balance of accounts[0]");
      assert.isAtLeast(result, 1, "didn't mint tokens");
      return dat.totalSupply.call();
    }).then(function(supply) {
      console.log(supply + " current totalSupply");
    });
  });

  it("should buy tokens for investor who pdat in other cryptos", function() {
    var random_int = randomInteger(100000, 10000000);

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.buyForInvestor(accounts[2], random_int, "txH", {
        from: accounts[4]
      })
    }).then(function(result) {
      console.log(result);
      return ContractAddress.dat.call()
    }).then(function(token) {
      dat = DAT.at(token);
      return dat.balanceOf.call(accounts[2]);
    }).then(function(balance) {
      balance = JSON.parse(balance);
      console.log(balance + " balance of accounts[2]");
      assert.isAtLeast(balance, random_int, "tokens weren't sent")
      return dat.totalSupply.call();
    }).then(function(supply) {
      console.log(supply + " current totalSupply");
    });

  });

  it("should get bonus correctly", function(){
        var random_int = randomInteger(1, 10000000);
        return DatariusICO.deployed().then(
            function(instance) {
             ContractAddress = instance;
             return ContractAddress.getBonus(random_int);
          }).then(function(result){
             result = JSON.parse(result);
             console.log(result + " result of getBonus");
             var	bonus = Math.floor(random_int * 35 /100);
             assert.equal(result, bonus, "Bonus isn't correct");
          });
  });

  it("should pause preICO", function() {
    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.pausePreIco({
        from: accounts[3]
      });
    }).catch(function(e) {
      assert(false, "preICO wasn't paused");
    }).then(function(tx) {
      console.log("This is receipt: " + tx.receipt);
      assert.notEqual(tx.receipt.logs.length, 0, "preICO wasn't paused");
    });
  });

  it("shouldn't send tokens, when investor sends ether to contract", function() {
    var flag = 0;

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.sendTransaction({
        from: accounts[3],
        value: 4000000000000000000
      });
    }).then(function() {
      flag = 1;
    }).catch(function(e) {
      assert(true, "shouldn't send tokens when ico isn't started");
    }).then(function() {
      if(flag) {
        assert(false, "shouldn't send tokens when ico isn't started");
      }
    });
  });

  it("shouldn't buy tokens for investor who pdat in other cryptos", function() {
    var random_int = randomInteger(100000, 10000000);
    var flag = 0;

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.buyForInvestor(accounts[1], random_int, "txH", {
        from: accounts[4]
      })
    }).then(function() {
      flag = 1;
    }).catch(function(e) {
      assert(true, "shouldn't buy tokens for investor when ico isn't started");
    }).then(function() {
      if(flag) {
        assert(false, "shouldn't send tokens when ico isn't started");
      }
    });
  });


  it("should start preICO", function() {
    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.startPreIco({
        from: accounts[3]
      });
    }).then(function(tx) {
      console.log("This is receipt: " + tx.receipt);
      assert.notEqual(tx.receipt.logs.length, 0, "preICO wasn't started");
    }).catch(function(e) {
      console.log("preICO wasn't started");
      console.log(e);
      assert(false, "preICO wasn't started");
    });
  });


  it("should send tokens, when investor sends ether to contract", function() {

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.sendTransaction({
        from: accounts[3],
        value: 2000000000000000000
      });
    }).then(function() {
      return ContractAddress.dat.call();
    }).then(function(token) {
      dat = DAT.at(token);
      return dat.balanceOf.call(accounts[3]);
    }).then(function(result) {
      console.log(result + " current balance of accounts[3]");
      assert.isAtLeast(result, 1, "didn't mint tokens");
      return dat.totalSupply.call();
    }).then(function(supply) {
      console.log(supply + " current totalSupply");
    });
  });

  it("should buy tokens for investor who pdat in other cryptos", function() {
    var random_int = randomInteger(100000, 10000000);
    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.buyForInvestor(accounts[1], random_int, "txH", {
        from: accounts[4]
      });
    }).then(function(result) {
      console.log(result);
      return ContractAddress.dat.call()
    }).then(function(token) {
      dat = DAT.at(token);
      return dat.balanceOf.call(accounts[1]);
    }).then(function(balance) {
      console.log(balance + " balance of accounts[1]");
      balance = JSON.parse(balance);
      assert.isAtLeast(balance, random_int, "tokens weren't sent")
      return dat.totalSupply.call();
    }).then(function(supply) {
      console.log(supply + " current totalSupply");
    });

  });

  it("should get bonus correctly", function(){
        var random_int = randomInteger(1, 10000000);
        return DatariusICO.deployed().then(
            function(instance) {
             ContractAddress = instance;
             return ContractAddress.getBonus(random_int);
          }).then(function(result){
             result = JSON.parse(result);
             console.log(result + " result of getBonus");
             var	bonus = Math.floor(random_int * 35 /100);
             assert.equal(result, bonus, "Bonus isn't correct");
          });
  });

  it("shouldn't withdraw ether", function() {
    var flag = 0;

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.withdrawEther(web3.toWei(1, "ether"), {
        from: accounts[3]
      })
    }).then(function() {
      flag = 1;
    }).catch(function(e) {
      assert(true, "shouldn't withdraw");
    }).then(function() {
      if(flag) {
        assert(false, "shouldn't withdraw");
      }
    });
  });

  it("should finish preICO", function() {

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.finishPreIco({
        from: accounts[3]
      });
    }).catch(function(e) {
      console.log("preICO wasn't finished");
      console.log(e);
      assert(false, "preICO wasn't finished");
    }).then(function(tx) {
      console.log("This is receipt: " + tx.receipt);
      assert.notEqual(tx.receipt.logs.length, 0, "preICO wasn't finished");
    });

  });

  it("should withdraw ether", function() {
    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.withdrawEther(web3.toWei(6, "ether"), {
        from: accounts[3]
      });
    }).then(function(result) {
      console.log(result);
    }).then(function() {
      return (web3.eth.getBalance(ContractAddress.address))
    }).then(function(balance) {
      balance = JSON.parse(balance);
      console.log(balance + " balance of our contract");
      assert.equal(balance, 0, "doesn't withdraw ether right")
    })
  });

  it("shouldn't send tokens, when investor sends ether to contract", function() {
    var flag = 0;

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.sendTransaction({
        from: accounts[3],
        value: 4000000000000000000
      });
    }).then(function() {
      flag = 1;
    }).catch(function(e) {
      assert(true, "shouldn't send tokens when ico isn't started");
    }).then(function() {
      if(flag) {
        assert(false, "shouldn't buy tokens for investor when ico isn't started");
      }
    });
  });

  it("shouldn't buy tokens for investor who pdat in other cryptos", function() {
    var random_int = randomInteger(100000, 10000000);
    var flag = 0;

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.buyForInvestor(accounts[1], random_int, "txH", {
        from: accounts[4]
      })
    }).then(function() {
      flag = 1;
    }).catch(function(e) {
      assert(true, "shouldn't buy tokens for investor when ico isn't started");
    }).then(function() {
      if(flag) {
        assert(false, "shouldn't buy tokens for investor when ico isn't started");
      }
    });
  });

  it("should set rate correctly", function() {

    var random_int = randomInteger(1, 1000);

    return DatariusICO.deployed().then(
      function(instance) {
        ContractAddress = instance;
        return ContractAddress.setRate(random_int, {
          from: accounts[3]
        });
    }).then(function(tx) {
      return ContractAddress.Rate_Eth.call();;
    }).then(function(rate) {
      assert.equal(rate, random_int, "Rate_Eth isn't correct");
    });

  });


  it("should start ICO", function() {
    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.startIco({
        from: accounts[3]
      });
    }).then(function(tx) {
      console.log("This is receipt: " + tx.receipt);
      assert.notEqual(tx.receipt.logs.length, 0, "ICO wasn't started");
    }).catch(function(e) {
      console.log("ICO wasn't started");
      console.log(e);
      assert(false, "ICO wasn't started");
    });
  });

  it("should send tokens, when investor sends ether to contract", function() {

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.sendTransaction({
        from: accounts[9],
        value: 3000000000000000000
      });
    }).then(function() {
      return ContractAddress.dat.call();
    }).then(function(token) {
      dat = DAT.at(token);
      return dat.balanceOf.call(accounts[9]);
    }).then(function(result) {
      console.log(result + " current balance of accounts[0]");
      assert.isAtLeast(result, 1, "didn't mint tokens");
      return dat.totalSupply.call();
    }).then(function(supply) {
      console.log(supply + " current totalSupply");
    });
  });

  it("should buy tokens for investor who pdat in other cryptos", function() {
    var random_int = randomInteger(100000, 10000000);

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.buyForInvestor(accounts[8], random_int, "txH", {
        from: accounts[4]
      })
    }).then(function(result) {
      console.log(result);
      return ContractAddress.dat.call()
    }).then(function(token) {
      dat = DAT.at(token);
      return dat.balanceOf.call(accounts[8]);
    }).then(function(balance) {
      balance = JSON.parse(balance);
      console.log(balance + " balance of accounts[8]");
      assert.isAtLeast(balance, random_int, "tokens weren't sent")
      return dat.totalSupply.call();
    }).then(function(supply) {
      console.log(supply + " current totalSupply");
    });

  });

  it("should get bonus correctly", function(){
        var random_int = randomInteger(1, 10000000);
        return DatariusICO.deployed().then(
            function(instance) {
             ContractAddress = instance;
             return ContractAddress.getBonus(random_int);
          }).then(function(result){
             result = JSON.parse(result);
             console.log(result + " result of getBonus");
             var	bonus = Math.floor(random_int * 30 /100);
             assert.equal(result, bonus, "Bonus isn't correct");
          });
  });

  it("should get bonus correctly", function(){
        timeTravel(100 * 3600);
        var random_int = 100;//randomInteger(1, 10000000);
        return DatariusICO.deployed().then(
            function(instance) {
             ContractAddress = instance;
             return ContractAddress.getBonus(random_int);
          }).then(function(result){
             result = JSON.parse(result);
             console.log(result + " result of getBonus");
             var	bonus = Math.floor(random_int * 25 /100);
             assert.equal(result, bonus, "Bonus isn't correct");
          });
  });

  it("should get bonus correctly", function(){
        timeTravel(6 * 3600);
        var random_int = 100;//randomInteger(1, 10000000);
        return DatariusICO.deployed().then(
            function(instance) {
             ContractAddress = instance;
             return ContractAddress.getBonus(random_int);
          }).then(function(result){
             result = JSON.parse(result);
             console.log(result + " result of getBonus");
             var	bonus = Math.floor(random_int * 20 /100);
             assert.equal(result, bonus, "Bonus isn't correct");
          });
  });

  it("should get bonus correctly", function(){
        timeTravel(12 * 3600);
        var random_int = 100;//randomInteger(1, 10000000);
        return DatariusICO.deployed().then(
            function(instance) {
             ContractAddress = instance;
             return ContractAddress.getBonus(random_int);
          }).then(function(result){
             result = JSON.parse(result);
             console.log(result + " result of getBonus");
             var	bonus = Math.floor(random_int * 10 /100);
             assert.equal(result, bonus, "Bonus isn't correct");
          });
  });

  it("should get bonus correctly", function(){
        timeTravel(24 * 3600);
        var random_int = 100;//randomInteger(1, 10000000);
        return DatariusICO.deployed().then(
            function(instance) {
             ContractAddress = instance;
             return ContractAddress.getBonus(random_int);
          }).then(function(result){
             result = JSON.parse(result);
             console.log(result + " result of getBonus");
             assert.equal(result, 0, "Bonus isn't correct");
          });
  });

  it("should pause ICO", function() {
    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.pauseIco({
        from: accounts[3]
      });
    }).catch(function(e) {
      assert(false, "ICO wasn't paused");
    }).then(function(tx) {
      console.log("This is receipt: " + tx.receipt);
      assert.notEqual(tx.receipt.logs.length, 0, "ICO wasn't paused");
    });
  });

  it("shouldn't send tokens, when investor sends ether to contract", function() {
    var flag = 0;

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.sendTransaction({
        from: accounts[3],
        value: 4000000000000000000
      });
    }).then(function() {
      flag = 1;
    }).catch(function(e) {
      assert(true, "shouldn't send tokens when ico isn't started");
    }).then(function() {
      if(flag) {
        assert(false, "shouldn't send tokens when ico isn't started");
      }
    });
  });

  it("shouldn't buy tokens for investor who pdat in other cryptos", function() {
    var random_int = randomInteger(100000, 10000000);
    var flag = 0;

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.buyForInvestor(accounts[1], random_int, "txH", {
        from: accounts[4]
      })
    }).then(function() {
      flag = 1;
    }).catch(function(e) {
      assert(true, "shouldn't buy tokens for investor when ico isn't started");
    }).then(function() {
      if(flag) {
        assert(false, "shouldn't send tokens when ico isn't started");
      }
    });
  });


  it("should start ICO", function() {
    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.startIco({
        from: accounts[3]
      });
    }).then(function(tx) {
      console.log("This is receipt: " + tx.receipt);
      assert.notEqual(tx.receipt.logs.length, 0, "ICO wasn't started");
    }).catch(function(e) {
      console.log("ICO wasn't started");
      console.log(e);
      assert(false, "ICO wasn't started");
    });
  });


  it("should send tokens, when investor sends ether to contract", function() {

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.sendTransaction({
        from: accounts[7],
        value: 1000000000000000000
      });
    }).then(function() {
      return ContractAddress.dat.call();
    }).then(function(token) {
      dat = DAT.at(token);
      return dat.balanceOf.call(accounts[1]);
    }).then(function(result) {
      console.log(result + " current balance of accounts[3]");
      assert.isAtLeast(result, 1, "didn't mint tokens");
      return dat.totalSupply.call();
    }).then(function(supply) {
      console.log(supply + " current totalSupply");
    });
  });

  it("should buy tokens for investor who paid in other cryptos", function() {
    var random_int = randomInteger(100000, 10000000);
    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.buyForInvestor(accounts[6], random_int, "txH", {
        from: accounts[4]
      });
    }).then(function(result) {
      console.log(result);
      return ContractAddress.dat.call()
    }).then(function(token) {
      dat = DAT.at(token);
      return dat.balanceOf.call(accounts[6]);
    }).then(function(balance) {
      console.log(balance + " balance of accounts[6]");
      balance = JSON.parse(balance);
      assert.isAtLeast(balance, random_int, "tokens weren't sent")
      return dat.totalSupply.call();
    }).then(function(supply) {
      console.log(supply + " current totalSupply");
    });

  });

  it("shouldn't withdraw ether", function() {
    var flag = 0;

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.withdrawEther(web3.toWei(1, "ether"), {
        from: accounts[3]
      })
    }).then(function() {
      flag = 1;
    }).catch(function(e) {
      assert(true, "shouldn't withdraw");
    }).then(function() {
      if(flag) {
        assert(false, "shouldn't withdraw");
      }
    });
  });

  it("should finish ICO", function() {

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.finishIco({
        from: accounts[3]
      });
    }).catch(function(e) {
      console.log("ICO wasn't finished");
      console.log(e);
      assert(false, "ICO wasn't finished");
    }).then(function(tx) {
      console.log("This is receipt: " + tx.receipt);
      assert.notEqual(tx.receipt.logs.length, 0, "ICO wasn't finished");
    });

  });

  it("should withdraw ether", function() {
    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.withdrawEther(web3.toWei(4, "ether"), {
        from: accounts[3]
      });
    }).then(function(result) {
      console.log(result);
    }).then(function() {
      return (web3.eth.getBalance(ContractAddress.address))
    }).then(function(balance) {
      balance = JSON.parse(balance);
      console.log(balance + " balance of our contract");
      assert.equal(balance, 0, "doesn't withdraw ether right")
    })
  });

  it("shouldn't send tokens, when investor sends ether to contract", function() {
    var flag = 0;

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.sendTransaction({
        from: accounts[3],
        value: 4000000000000000000
      });
    }).then(function() {
      flag = 1;
    }).catch(function(e) {
      assert(true, "shouldn't send tokens when ico isn't started");
    }).then(function() {
      if(flag) {
        assert(false, "shouldn't buy tokens for investor when ico isn't started");
      }
    });
  });

  it("shouldn't buy tokens for investor who pdat in other cryptos", function() {
    var random_int = randomInteger(100000, 10000000);
    var flag = 0;

    return DatariusICO.deployed().then(function(instance) {
      ContractAddress = instance;
      return ContractAddress.buyForInvestor(accounts[1], random_int, "txH", {
        from: accounts[4]
      })
    }).then(function() {
      flag = 1;
    }).catch(function(e) {
      assert(true, "shouldn't buy tokens for investor when ico isn't started");
    }).then(function() {
      if(flag) {
        assert(false, "shouldn't buy tokens for investor when ico isn't started");
      }
    });
  });

});
