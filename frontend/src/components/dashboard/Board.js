import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  PROJECT_DATA_ADD_LIST,
  PROJECT_DATA_ADD_TASK,
  PROJECT_DATA_UPDATE_LISTS,
} from '../../redux/constants/projectConstants';

import { makeStyles } from '@material-ui/core';

import Lists from './lists/Lists';
import Navbar from './navbar/Navbar';

const useStyles = makeStyles(() => ({
  boardContainer: {
    height: '100vh',
    position: 'relative',
  },

  board: {
    height: '100vh',
    display: 'grid',
    flexWrap: 'nowrap',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflowX: 'auto',
  },
}));

const Board = () => {
  const { socket } = useSelector((state) => state.socketConnection);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    socket.on('new-task', (data) => {
      dispatch({ type: PROJECT_DATA_ADD_TASK, payload: data });
    });
    socket.on('lists-update', (data) => {
      dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: data });
    });
    socket.on('list-added', (data) => {
      console.log(data);
      dispatch({ type: PROJECT_DATA_ADD_LIST, payload: data });
    });
  }, [dispatch, socket]);

  return (
    <div className={classes.boardContainer}>
      <Navbar />
      <div className={classes.board}>
        <Lists />
      </div>
    </div>
  );
};

export default Board;
