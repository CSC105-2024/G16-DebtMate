import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Group.css"; // Assuming you have a CSS file for styling

const Group = ({ group }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/edit-group/${group.id}`);
  };

  return (
    <div className="group-container">
      <div className="group-header">
        <h2 className="group-name">{group.name}</h2>
        <button
          className="edit-group-btn"
          onClick={handleEditClick}
          aria-label="Edit group"
        >
          <img
            src="/assets/icons/esIcon.svg"
            alt="Edit"
            className="edit-icon"
          />
        </button>
      </div>
      {/* Other group details here */}
    </div>
  );
};

export default Group;
