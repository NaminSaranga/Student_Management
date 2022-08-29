import React from "react";

const NoteItem = (props) => {
  return (
    <li>
      {props.note.title}
      {props.note.description}
    </li>
  );
};

export default NoteItem;
