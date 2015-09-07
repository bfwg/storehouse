/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var _ = require('lodash');
var Cards = require('./data/cards.js');


var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
} = React;

var hsBrowser = React.createClass({
  getInitialState: function() {
    return {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })
    };
  },

  componentDidMount: function() {
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(Cards.cards)
      });
  },

  render: function() {
    return (
      <ListView dataSource={this.state.dataSource} renderRow={this.renderCard} style={styles.listView} ></ListView>
    );
  },

  renderCard: function(card) {
    return (
      <View style={styles.listview}>
        <Image source={{uri: card.image_url}} style={styles.thumbnail}></Image>
        <View style={styles.cardMetaData}>
            <Text style={styles.text}>{card.name}</Text>
            <Text style={styles.text}>Hero: {card.hero}</Text>
            <Text style={styles.text}>{card.description}</Text>
            <Text style={styles.text}>{card.mana} mana</Text>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'white'
  },
  listView: {
    paddingTop: 30,
    backgroundColor: '#625545'
  },
  thumbnail: {
    width: 53,
    height: 81
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  cardMetaData: {
    flex: 1
  }
});

AppRegistry.registerComponent('hsBrowser', () => hsBrowser);
