import Card from "./components/Card/Card";

import ImapAccountForm from "./containers/ImapAccountForm/ImapAccountForm";
import NotionAccountForm from "./containers/NotionAccountForm/NotionAccountForm";

function App() {
  return (
    <div className="App h-screen bg-gray-100">
      <header className="p-5 bg-blue-500 text-5xl font-bold text-white border border-purple-600 shadow-lg">
        <h1>email2notion</h1>
      </header>
      <div className="flex flex-row flex-wrap justify-between p-10 space-x-10">
        <Card title="IMAP Account Settings">
          <ImapAccountForm />
        </Card>
        <Card title="Notion Account Settings">
          <NotionAccountForm />
        </Card>
      </div>
    </div>
  );
}

export default App;
