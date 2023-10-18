import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { taskFieldUpdate } from "../../../../redux/actions/projectActions";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { makeStyles, Button, ClickAwayListener } from "@material-ui/core";
import {
  EditorState,
  AtomicBlockUtils,
  convertToRaw,
  ContentState,
} from "draft-js";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import Loader from "../../../Loader";
import { io } from "socket.io-client";

const useStyles = makeStyles(() => ({
  root: {
    "& .ck-editor__editable_inline": {
      minHeight: 100,
    },
  },
  textContainer: {
    display: "flex",
    justifyContent: "space-between",
    "& svg": {
      marginRight: 15,
    },
  },
  text: {
    display: "flex",
    alignItems: "center",
  },

  description: {
    margin: "8px 25px",
  },
  descriptionTextArea: {
    "& .MuiFilledInput-multiline": {
      padding: "15px 10px",
      fontSize: "0.95rem",
      color: "#525252",
    },
    "& .MuiFilledInput-multiline:before": {
      borderBottomStyle: "solid",
    },
  },

  actions: {
    marginTop: 10,
    textAlign: "right",
    "& >button:first-child": {
      marginRight: 5,
    },
  },
  fixEditorClosing: {
    width: "100%",
    display: "flex",
  },
  caption: {
    color: "#979a9a",
  },
}));

const TaskDescription = ({ task, userPermissions, disabled }) => {
  const dispatch = useDispatch();
  const [descriptionEditOpen, setDescriptionEditOpen] = useState(false);
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (task.description) {
      const contentBlock = htmlToDraft(task?.description);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      setDescription(EditorState.createWithContent(contentState));
    }
  }, [task]);

  const updateHandle = () => {
    if (description !== task.description) {
      setLoading(true);
      const socket = io.connect("http://localhost:5000", {
        transports: ["websocket", "polling", "flashsocket"],
        auth: {
          authorization: `Bearer ${userInfo?.token}`,
        },
      });
      console.log(draftToHtml(convertToRaw(description.getCurrentContent())));
      socket.on("connect", () => {
        dispatch(
          taskFieldUpdate(
            task._id,
            task.projectId,
            draftToHtml(convertToRaw(description.getCurrentContent())),
            "description",
            () => {
              setLoading(false);
              setDescriptionEditOpen(false);
            }
          )
        );
      });
    }
  };

  const escBlurHandle = (e) => {
    if (e.key === "Escape") {
      setDescriptionEditOpen(false);
      const [editor] = document.getElementsByClassName("ck-content");
      if (editor) editor.blur();
    }
  };

  const onDescriptionChange = (editorContent) => {
    setDescription(editorContent);
  };

  return (
    <ClickAwayListener
      mouseEvent={"onMouseDown"}
      onClickAway={() =>
        !loading && descriptionEditOpen && setDescriptionEditOpen(false)
      }
    >
      <div className={classes.root} onKeyDown={escBlurHandle}>
        <Editor
          editorState={description}
          wrapperClassName="demo-wrapper"
          wrapperStyle={{ color: "rgb(25,25,25)" }}
          editorStyle={{
            background: "#fff",
            color: "rgb(25,25,25)",
            padding: 20,
            minHeight: "30vh",
          }}
          onEditorStateChange={onDescriptionChange}
        />
        {/* <CKEditor
          editor={ClassicEditor}
          config={{
            toolbar: userPermissions >= 1 && [
              "heading",
              "|",
              "bold",
              "italic",
              "blockQuote",
              "link",
              "numberedList",
              "bulletedList",
              "alignment",
              "insertTable",
              "|",
              "undo",
              "redo",
            ],
          }}
          isReadOnly={false}
          disabled={loading || disabled}
          data={task.description || description}
          onChange={(event, editor) => {
            console.log("===", event, editor.getData());
            setDescription(editor.getData());
          }}
          onFocus={(event, editor) => setDescriptionEditOpen(true)}
        />  */}
         { (
        <div className={classes.actions}>
          <Button
            color="secondary"
            onClick={() => setDescriptionEditOpen(false)}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="outlined"
            disabled={loading}
            onClick={updateHandle}
          >
            Save
            {loading && <Loader button />}
          </Button>
          </div>
         )}
      </div>
    </ClickAwayListener>
  );
};

export default TaskDescription;
