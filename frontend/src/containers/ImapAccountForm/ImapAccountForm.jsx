import { useState, useEffect } from "react";

import FormElement from "../../components/FormElement/FormElement";
import Button from "../../components/Button/Button";

const ImapAccountForm = ({ mailserver, onApply }) => {
  const [imapHost, setImapHost] = useState("");
  const [imapPort, setImapPort] = useState("");
  const [imapUser, setImapUser] = useState("");
  const [imapPassw, setImapPassw] = useState("");

  useEffect(() => {
    setImapHost(mailserver.host);
    setImapPort(mailserver.port);
    setImapUser(mailserver.user);
    setImapPassw(mailserver.passw);
  }, [mailserver]);

  const fieldChangeHandler = (event) => {
    switch (event.target.name) {
      case "imap_host":
        setImapHost(event.target.value);
        break;

      case "imap_port":
        setImapPort(event.target.value);
        break;

      case "imap_user":
        setImapUser(event.target.value);
        break;

      case "imap_passw":
        setImapPassw(event.target.value);
        break;

      default:
        //do nothing here
        break;
    }
  };

  const applyHandler = () => {
    onApply({
      ...mailserver,
      host: imapHost,
      port: imapPort,
      user: imapUser,
      passw: imapPassw,
    });
  };

  return (
    <form>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row justify-between space-x-10">
          <div className="flex-grow">
            <FormElement
              type="text"
              label="Host"
              name="imap_host"
              id="imap_host"
              value={imapHost}
              onChange={fieldChangeHandler}
            />
          </div>
          <FormElement
            type="text"
            label="Port"
            name="imap_port"
            id="imap_port"
            value={imapPort}
            onChange={fieldChangeHandler}
          />
        </div>
        <FormElement
          type="text"
          label="Username"
          name="imap_user"
          id="imap_user"
          value={imapUser}
          onChange={fieldChangeHandler}
        />
        <FormElement
          type="password"
          label="Password"
          name="imap_passw"
          id="imap_passw"
          value={imapPassw}
          onChange={fieldChangeHandler}
        />
        <div className="flex flex-row-reverse">
          <Button onClick={applyHandler}>Apply</Button>
        </div>
      </div>
    </form>
  );
};

export default ImapAccountForm;
