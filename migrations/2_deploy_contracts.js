var ICO = artifacts.require("./DatariusICO.sol");
var DAT = artifacts.require("./DAT.sol");

module.exports = function(deployer, network, accounts) {

    deployer.deploy(ICO, accounts[1], accounts[5], accounts[5], accounts[5], accounts[5], accounts[3], accounts[4], accounts[4], accounts[4]);

};
