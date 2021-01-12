import { useState, useEffect } from "react";

import FormElement from "../../components/FormElement/FormElement";
import Button from "../../components/Button/Button";

const FolderMappingForm = ({
  mailserverId,
  notionAccountId,
  folderMapping,
  onApply,
}) => {
  const [mailboxList, setMailboxList] = useState([]);
  const [pagesList, setPagesList] = useState({});
  const [srcMailbox, setSrcMailbox] = useState("");
  const [destPage, setDestPage] = useState("");

  useEffect(() => {
    if (mailserverId) {
      fetch(`/mailservers/${mailserverId}/mailboxes`).then(
        (mailboxesResponse) => {
          mailboxesResponse.json().then((mailboxesResponseData) => {
            setMailboxList(mailboxesResponseData);
          });
        }
      );
    }

    if (notionAccountId) {
      fetch(`/notionaccounts/${notionAccountId}/pages`).then(
        (pagesResponse) => {
          pagesResponse.json().then((pagesResponseData) => {
            setPagesList(pagesResponseData);
          });
        }
      );
    }

    setSrcMailbox(folderMapping.src_mailbox);
    setDestPage(folderMapping.dest_page);
  }, [mailserverId, notionAccountId, folderMapping]);

  const srcMailboxChangeHandler = (event) => {
    setSrcMailbox(event.target.value);
  };

  const destPageChangeHandler = (event) => {
    setDestPage(event.target.value);
  };

  const applyHandler = () => {
    onApply({
      ...folderMapping,
      src_mailserver: mailserverId,
      src_mailbox: srcMailbox,
      dest_notionaccount: notionAccountId,
      dest_page: destPage,
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row justify-between space-x-10">
        <div className="flex-grow">
          <FormElement
            type="select"
            label="Source"
            name="src-mailbox"
            id="src-mailbox"
            onChange={srcMailboxChangeHandler}
          >
            <option key="default" />
            {mailboxList.map((mailbox) => (
              <option
                key={mailbox}
                value={mailbox}
                selected={mailbox === srcMailbox}
              >
                {mailbox}
              </option>
            ))}
          </FormElement>
        </div>
        <div className="flex flex-col justify-end text-5xl font-bold text-gray-500">
          {"\u{1f846}"}
        </div>
        <div className="flex-grow">
          <FormElement
            type="select"
            label="Destination"
            name="dest-page"
            id="dest-page"
            onChange={destPageChangeHandler}
          >
            <option key="default" />
            {Object.keys(pagesList).map((pageId) => (
              <option
                key={pageId}
                value={pageId}
                selected={pageId === destPage}
              >
                {pagesList[pageId]}
              </option>
            ))}
          </FormElement>
        </div>
      </div>
      <div className="flex flex-row-reverse">
        <Button type="submit" onClick={applyHandler}>
          Apply
        </Button>
      </div>
    </div>
  );
};

export default FolderMappingForm;
