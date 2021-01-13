import { useState, useEffect } from "react";

import FormElement from "../../components/FormElement/FormElement";
import Button from "../../components/Button/Button.jsx";

const NotionAccountForm = ({ notionAccount, onApply }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(notionAccount.token);
  }, [notionAccount]);

  const tokenChangeHandler = (event) => {
    setToken(event.target.value);
  };

  const applyHandler = () => {
    onApply({
      ...notionAccount,
      token: token,
    });
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
          <Button onClick={applyHandler}>Apply</Button>
        </div>
      </div>
    </form>
  );
};

export default NotionAccountForm;
