import "../css/contactItemStyle.css";

const ContactItem = ({ contact, onClick }) => {
  if (!contact) {
    return null;
  }

  console.log(contact);

  return (
    <div className="cn" onClick={() => onClick()}>
      <img
          src={
            contact.getProfileImageUrl()
              ? contact.getProfileImageUrl()
              : "avatar.png"
          }
          alt="user profile"
          className="avatar"
        />
      <div className="infoContainer">
        <div className="unamec">
          <p className="uname unselectable">{contact.getName()}</p>
          <p className="uabout unselectable">{contact.getAbout()}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactItem;
