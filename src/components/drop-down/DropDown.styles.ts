import css from "../../custom-element/styles/css";

export const dropDownStyles = css`
/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
  border: 1px solid black;
  padding: 0 0 0 1rem;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
  
/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {
    display:block;
}`;