import { useState, useEffect } from "react";

import Card from "./components/Card/Card";

import ImapAccountForm from "./containers/ImapAccountForm/ImapAccountForm";
import NotionAccountForm from "./containers/NotionAccountForm/NotionAccountForm";
import FolderMappingForm from "./containers/FolderMappingForm/FolderMappingForm";

function App() {
  const [notionAccountData, setNotionAccountData] = useState({
    id: null,
    token: "",
  });

  const [mailserverData, setMailserverData] = useState({
    id: null,
    host: "",
    port: "",
    user: "",
    passw: "",
  });

  useEffect(() => {
    fetch("/notionaccounts").then((notionAccountResult) => {
      if (notionAccountResult) {
        notionAccountResult.json().then((notionAccountData) => {
          if (notionAccountData.length > 0) {
            setNotionAccountData(notionAccountData[0]);
          }
        });
      }
    });

    fetch("/mailservers").then((imapAccountResult) => {
      if (imapAccountResult) {
        imapAccountResult.json().then((imapAccountData) => {
          if (imapAccountData.length > 0) {
            setMailserverData(imapAccountData[0]);
          }
        });
      }
    });
  }, []);

  const mailserverApplyHandler = (updatedMailserverData) => {
    const params = new URLSearchParams({
      name: "default",
      host: updatedMailserverData.host,
      port: updatedMailserverData.port,
      user: updatedMailserverData.user,
      passw: updatedMailserverData.passw,
    });

    // ID should only exist if the data was pulled from the API
    // As such, this can be used as a flag to know if an asset
    // should be created or update
    if (updatedMailserverData.id) {
      // PUT
      fetch(`/mailservers/${updatedMailserverData.id}`, {
        method: "PUT",
        body: params,
      }).then((updateResponse) => {
        updateResponse.json().then((updateResponseData) => {
          setMailserverData(updateResponseData);
        });
      });
    } else {
      // POST
      fetch("/mailservers", {
        method: "POST",
        body: params,
      }).then((updateResponse) => {
        updateResponse.json().then((updateResponseData) => {
          setMailserverData(updateResponseData);
        });
      });
    }
  };

  const notionAccountApplyHandler = (updatedNotionAccountData) => {
    const params = new URLSearchParams({
      name: "default",
      token: updatedNotionAccountData.token,
    });

    // ID should only exist if the data was pulled from the API
    // As such, this can be used as a flag to know if an asset
    // should be created or update
    if (updatedNotionAccountData.id) {
      // PUT
      fetch(`/notionaccounts/${updatedNotionAccountData.id}`, {
        method: "PUT",
        body: params,
      }).then((updateResponse) => {
        updateResponse.json().then((updateResponseData) => {
          setNotionAccountData(updateResponseData);
        });
      });
    } else {
      // POST
      fetch("/notionaccounts", {
        method: "POST",
        body: params,
      }).then((updateResponse) => {
        updateResponse.json().then((updateResponseData) => {
          setNotionAccountData(updateResponseData);
        });
      });
    }
  };

  return (
    <div className="App h-screen bg-gray-100">
      <header className="p-5 bg-blue-500 text-5xl font-bold text-white border border-purple-600 shadow-lg">
        <h1>email2notion</h1>
      </header>
      <div className="flex flex-col p-10 space-y-10">
        <div className="flex flex-row flex-wrap justify-between space-x-10">
          <Card title="IMAP Account Settings">
            <ImapAccountForm
              mailserver={mailserverData}
              onApply={mailserverApplyHandler}
            />
          </Card>
          <Card title="Notion Account Settings">
            <NotionAccountForm
              notionAccount={notionAccountData}
              onApply={notionAccountApplyHandler}
            />
          </Card>
        </div>
        <Card title="Mappings">
          <FolderMappingForm
            mailserverId={mailserverData.id}
            notionAccountId={notionAccountData.id}
          />
        </Card>
      </div>
    </div>
  );
}

export default App;
