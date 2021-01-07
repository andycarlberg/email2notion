import { useState, useEffect } from "react";

import FormElement from "../../components/FormElement/FormElement";
import Button from "../../components/Button/Button.jsx";

const NotionAccountForm = () => {
  // ID should only exist if the data was pulled from the API
  // As such, this can be used as a flag to know if an asset
  // should be created or update
  const [notionId, setNotionId] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    fetch("/notionaccounts").then((notionAccountResult) => {
      if (notionAccountResult) {
        notionAccountResult.json().then((notionAccountData) => {
          if (notionAccountData.length > 0) {
            setNotionId(notionAccountData[0].id);
            setToken(notionAccountData[0].token);
          }
        });
      }
    });
  }, []);

  const tokenChangeHandler = (event) => {
    setToken(event.target.value);
  };

  const applyHandler = () => {
    const params = new URLSearchParams({
      name: "default",
      token: token,
    });

    if (notionId) {
      // PUT
      fetch(`/notionaccounts/${notionId}`, {
        method: "PUT",
        body: params,
      }).then((updateResponse) => {
        updateResponse.json().then((updateResponseData) => {
          setNotionId(updateResponseData.id);
          setToken(updateResponseData.token);
        });
      });
    } else {
      // POST
      fetch("/notionaccounts", {
        method: "POST",
        body: params,
      }).then((updateResponse) => {
        updateResponse.json().then((updateResponseData) => {
          setNotionId(updateResponseData.id);
          setToken(updateResponseData.token);
        });
      });
    }
  };

  return (
    <form>
      <div className="flex flex-col space-y-4">
        <FormElement
          type="password"
          label="Token"
          name="notion_token"
          id="notion_token"
          value={token}
          onChange={tokenChangeHandler}
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

export default NotionAccountForm;
