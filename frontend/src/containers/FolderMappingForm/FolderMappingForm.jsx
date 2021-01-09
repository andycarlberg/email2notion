import { useState, useEffect } from "react";

import FormElement from "../../components/FormElement/FormElement";
import Button from "../../components/Button/Button";

const FolderMappingForm = ({ mailserverId, notionAccountId }) => {
  const [mailboxList, setMailboxList] = useState([]);
  const [pagesList, setPagesList] = useState({});

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
  }, [mailserverId, notionAccountId]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row justify-between space-x-10">
        <div className="flex-grow">
          <FormElement
            type="select"
            label="Source"
            name="src-mailbox"
            id="src-mailbox"
          >
            {mailboxList.map((mailbox) => (
              <option key={mailbox} value={mailbox}>
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
          >
            {Object.keys(pagesList).map((pageId) => (
              <option key={pageId} value={pageId}>
                {pagesList[pageId]}
              </option>
            ))}
          </FormElement>
        </div>
      </div>
      <div className="flex flex-row-reverse">
        <Button type="submit">Apply</Button>
      </div>
    </div>
  );
};

export default FolderMappingForm;
