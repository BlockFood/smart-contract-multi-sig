pragma solidity ^0.4.18;

contract MultiSignatureWallet {

    address[] public owners;
    uint public signaturesRequired;

    function MultiSignatureWallet(
        address[] owners_,
        uint signaturesRequired_
    )
    public
    {
        owners = owners_;
        signaturesRequired = signaturesRequired_;
    }
}
