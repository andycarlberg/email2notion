import { useState, useEffect } from "react";

import Card from "./components/Card/Card";

import ImapAccountForm from "./containers/ImapAccountForm/ImapAccountForm";
import NotionAccountForm from "./containers/NotionAccountForm/NotionAccountForm";
import FolderMappingForm from "./containers/FolderMappingForm/FolderMappingForm";
import ConfigurationForm from "./containers/ConfigurationForm/ConfigurationForm";

function App() {
  const [configData, setConfigData] = useState({
    check_freq: "",
  });

  const [mailserverData, setMailserverData] = useState({
    id: null,
    host: "",
    port: "",
    user: "",
    passw: "",
  });

  const [notionAccountData, setNotionAccountData] = useState({
    id: null,
    token: "",
  });

  const [folderMappingData, setFolderMappingData] = useState({
    id: null,
    src_mailserver: null,
    src_mailbox: "",
    dest_notionaccount: null,
    dest_page: "",
  });

  useEffect(() => {
    fetch("/configuration").then((configResult) => {
      if (configResult) {
        configResult.json().then((configData) => {
          setConfigData(configData);
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

    fetch("/notionaccounts").then((notionAccountResult) => {
      if (notionAccountResult) {
        notionAccountResult.json().then((notionAccountData) => {
          if (notionAccountData.length > 0) {
            setNotionAccountData(notionAccountData[0]);
          }
        });
      }
    });

    fetch("/foldermappings").then((folderMappingResult) => {
      if (folderMappingResult) {
        folderMappingResult.json().then((folderMappingData) => {
          if (folderMappingData.length > 0) {
            setFolderMappingData(folderMappingData[0]);
          }
        });
      }
    });
  }, []);

  const configurationApplyHandler = (updatedConfigData) => {
    const params = new URLSearchParams({
      check_freq: updatedConfigData.check_freq,
    });

    fetch("/configuration", { method: "POST", body: params }).then(
      (updateResponse) => {
        updateResponse.json().then((updateResponseData) => {
          setConfigData(updateResponseData);
        });
      }
    );
  };

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

  const folderMappingApplyHandler = (updatedFolderMappingData) => {
    const params = new URLSearchParams({
      src_mailserver: updatedFolderMappingData.src_mailserver,
      src_mailbox: updatedFolderMappingData.src_mailbox,
      dest_notionaccount: updatedFolderMappingData.dest_notionaccount,
      dest_page: updatedFolderMappingData.dest_page,
    });

    // ID should only exist if the data was pulled from the API
    // As such, this can be used as a flag to know if an asset
    // should be created or update
    if (updatedFolderMappingData.id) {
      // PUT
      fetch(`/foldermappings/${updatedFolderMappingData.id}`, {
        method: "PUT",
        body: params,
      }).then((updateResponse) => {
        updateResponse.json().then((updateResponseData) => {
          setFolderMappingData(updateResponseData);
        });
      });
    } else {
      // POST
      fetch("/foldermappings", {
        method: "POST",
        body: params,
      }).then((updateResponse) => {
        updateResponse.json().then((updateResponseData) => {
          setFolderMappingData(updateResponseData);
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
          <Card title="Configuration">
            <ConfigurationForm
              config={configData}
              onApply={configurationApplyHandler}
            />
          </Card>
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
            folderMapping={folderMappingData}
            onApply={folderMappingApplyHandler}
          />
        </Card>
      </div>
    </div>
  );
}

export default App;
