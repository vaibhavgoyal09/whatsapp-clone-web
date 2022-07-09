import ContactItem from "./ContactItem";

const ContactsList = ({ contacts, onContactClicked }) => {
  return (
    <div className="contacts">
      {contacts.map((contact, index) => (
        <ContactItem
          key={index}
          contact={contact}
          onClick={() => onContactClicked(contacts[index])}
        />
      ))}
    </div>
  );
};

export default ContactsList;
