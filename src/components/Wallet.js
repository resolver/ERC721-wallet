// @format
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import Modal from "styled-react-modal";
import { ChasingDots } from "styled-spinkit";

import Token from "./Token";
import getWeb3 from "../utils/getWeb3";
import { fetchTransactionsBegin } from "../actions/fetchTransactions";
import TransferModal from "./TransferModal";

const StyledWallet = styled.div`
  width: 70%;
  margin-left: 15%;
  display: flex;
  align-items: space-between;
  flex-flow: row wrap;
  justify-content: space-between;
`;

const Separator = styled.div`
  width: 70%;
  margin-left: 15%;
  border-bottom: 1px solid black;
`;

class Wallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      modals: {}
    };
  }

  toggleModal = tokenId => {
    return () => {
      let modals = this.state.modals;
      modals[tokenId] = !modals[tokenId];
      this.setState({ modals });
    };
  };

  componentDidMount() {
    this.updateTransactions();
  }

  async updateTransactions() {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    this.props.getTransactions(accounts[0]);
    this.setState({ accounts });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.contracts !== prevProps.contracts) {
      this.updateTransactions();
    }
  }

  separator(i, name) {
    if (i === 0) {
      return (
        <Separator>
          <h3>{name}</h3>
        </Separator>
      );
    }
  }

  render() {
    const { modals } = this.state;
    const { transactions, loading } = this.props;
    if (loading) {
      return <ChasingDots color="#000" />;
    } else {
      return (
        <div>
          {Object.keys(transactions).map((contractAddress, i) => (
            <div key={i}>
              {this.separator(i, transactions[contractAddress][0].name)}
              <StyledWallet>
                {transactions[contractAddress].map(
                  ({ token, _tokenId, name, contract }, j) => (
                    <Token
                      key={j}
                      token={token}
                      tokenId={_tokenId}
                      name={name}
                      contract={contract}
                      modals={modals}
                      toggleModal={this.toggleModal}
                      account={this.state.accounts[0]}
                    />
                  )
                )}
              </StyledWallet>
            </div>
          ))}
        </div>
      );
    }
  }
}

const mapDispatchToProps = {
  getTransactions: fetchTransactionsBegin
};

const mapStateToProps = (state, ownProps) => {
  return {
    transactions: state.transactions.items,
    loading: state.transactions.loading,
    contracts: state.contracts.items
  };
};
Wallet = connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet);
export default Wallet;