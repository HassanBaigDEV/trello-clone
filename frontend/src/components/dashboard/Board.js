import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  PROJECT_DATA_ADD_LIST,
  PROJECT_DATA_ADD_TASK,
  PROJECT_DATA_JOIN_LINK_UPDATE,
  PROJECT_DATA_LIST_TITLE_UPDATE,
  PROJECT_DATA_TASK_ARCHIVED,
  PROJECT_DATA_TITLE_UPDATE,
  PROJECT_DATA_UPDATE_LISTS,
  PROJECT_DATA_USERS_UPDATE,
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
    socket.on('list-title-updated', (data) => {
      dispatch({ type: PROJECT_DATA_LIST_TITLE_UPDATE, payload: data });
    });
    socket.on('project-title-updated', (data) => {
      dispatch({ type: PROJECT_DATA_TITLE_UPDATE, payload: data });
    });
    socket.on('project-join-link-updated', (data) => {
      dispatch({ type: PROJECT_DATA_JOIN_LINK_UPDATE, payload: data });
    });
    socket.on('project-users-updated', (data) => {
      dispatch({ type: PROJECT_DATA_USERS_UPDATE, payload: data });
    });
    socket.on('task-archived', (data) => {
      dispatch({ type: PROJECT_DATA_TASK_ARCHIVED, payload: data });
    });
    return () => {
      socket.off('new-task');
      socket.off('lists-update');
      socket.off('list-added');
      socket.off('list-title-updated');
      socket.off('project-title-updated');
      socket.off('project-join-link-updated');
      socket.off('project-users-updated');
      socket.off('task-archived');
    };
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
