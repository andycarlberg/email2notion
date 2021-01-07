import { useState, useEffect } from "react";

import FormElement from "../../components/FormElement/FormElement";
import Button from "../../components/Button/Button";

const ImapAccountForm = () => {
  // ID should only exist if the data was pulled from the API
  // As such, this can be used as a flag to know if an asset
  // should be created or update
  const [imapId, setImapId] = useState("");
  const [imapHost, setImapHost] = useState("");
  const [imapPort, setImapPort] = useState("");
  const [imapUser, setImapUser] = useState("");
  const [imapPassw, setImapPassw] = useState("");

  useEffect(() => {
    fetch("/mailservers").then((imapAccountResult) => {
      if (imapAccountResult) {
        imapAccountResult.json().then((imapAccountData) => {
          if (imapAccountData.length > 0) {
            setImapId(imapAccountData[0].id);
            setImapHost(imapAccountData[0].host);
            setImapPort(imapAccountData[0].port);
            setImapUser(imapAccountData[0].user);
            setImapPassw(imapAccountData[0].passw);
          }
        });
      }
    });
  }, []);

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
    const params = new URLSearchParams({
      name: "default",
      host: imapHost,
      port: imapPort,
      user: imapUser,
      passw: imapPassw,
    });

    if (imapId) {
      // PUT
      fetch(`/mailservers/${imapId}`, {
        method: "PUT",
        body: params,
      }).then((updateResponse) => {
        updateResponse.json().then((updateResponseData) => {
          setImapId(updateResponseData.id);
          setImapHost(updateResponseData.host);
          setImapPort(updateResponseData.port);
          setImapUser(updateResponseData.user);
          setImapPassw(updateResponseData.passw);
        });
      });
    } else {
      // POST
      fetch("/mailservers", {
        method: "POST",
        body: params,
      }).then((updateResponse) => {
        updateResponse.json().then((updateResponseData) => {
          setImapId(updateResponseData.id);
          setImapHost(updateResponseData.host);
          setImapPort(updateResponseData.port);
          setImapUser(updateResponseData.user);
          setImapPassw(updateResponseData.passw);
        });
      });
    }
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
          <Button type="submit" onClick={applyHandler}>
            Apply
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ImapAccountForm;
