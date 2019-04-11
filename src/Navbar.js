import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,

  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  }
};
class ButtonAppBar extends Component {
  render() {
    return (
      <div style={styles.root}>
        <AppBar position="static" className="appbarcls">
          <Toolbar>
            {/* <IconButton style={styles.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton> */}
            <Typography variant="h6" color="inherit" style={styles.grow} className="appnamecls">
              QUIZ APPLICATION
          </Typography>
            {this.props.isLoggedin == false && <Button color="inherit" onClick={this.props.loginFunc}>LOGIN</Button>}
            {(this.props.isLoggedin == true && this.props.picture != '') && <div className="rightnavdiv">
              {/* <Avatar alt="Remy Sharp" source={{ uri: this.props.picture }} style={styles.bigAvatar} /> */}
              <Button color="inherit" onClick={this.props.logoutFunc}>LOGOUT</Button>
            </div>}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}


export default ButtonAppBar;