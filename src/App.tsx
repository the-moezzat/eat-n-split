import { useState } from 'react';

interface Friend {
  id: string | number;
  name: string;
  image: string;
  balance: number;
}

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friends, setFriends] = useState<Friend[]>(initialFriends);

  function handleAddFriend(name: string, image: string) {
    const newFriend = { name, image, id: crypto.randomUUID(), balance: 0 };
    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriend(false);
  }

  function handleSelectFriend(friend: Friend) {
    setSelectedFriend(friend.id === selectedFriend?.id ? null : friend);
    setShowAddFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelectFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={() => setShowAddFriend((show) => !show)}>
          {showAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>

      {selectedFriend && <FormSplitBill friend={selectedFriend} />}
    </div>
  );
}

function FriendsList({
  friends,
  onSelectFriend,
  selectedFriend,
}: {
  friends: Friend[];
  onSelectFriend: any;
  selectedFriend: Friend | null;
}) {
  return (
    <>
      <ul>
        {friends.map((friend) => (
          <Friend
            friend={friend}
            key={friend.id}
            selectedFriend={selectedFriend}
            onSelectFriend={onSelectFriend}
          />
        ))}
      </ul>
    </>
  );
}

function Friend({
  friend,
  onSelectFriend,
  selectedFriend,
}: {
  friend: Friend;
  onSelectFriend: any;
  selectedFriend: Friend | null;
}) {
  const isSelected = selectedFriend?.id === friend.id;

  function handleSelect() {
    onSelectFriend(friend);
  }

  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && (
        <p>
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      <Button onClick={handleSelect}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [friendName, setFriendName] = useState('');
  const [friendImage, setFriendImage] = useState('https://i.pravatar.cc/48');

  function handleAddFriend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!friendName || !friendImage) return;

    onAddFriend(friendName, friendImage);

    setFriendName('');
    setFriendImage('https://i.pravatar.cc/48');
  }

  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label>👫Friend name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />

      <label>📷Image URL</label>
      <input
        type="text"
        value={friendImage}
        onChange={(e) => setFriendImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend }: { friend: Friend }) {
  const [bill, setBill] = useState<number | string>('');
  const [expenses, setExpenses] = useState<number | string>('');
  const friendExpenses = +bill - +expenses;
  const [buyer, setBuyer] = useState('you');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleExpenses(e: React.ChangeEvent<HTMLInputElement>) {
    setExpenses(+e.target.value > +bill ? expenses : +e.target.value);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label>🚶‍♂️ Your expense:</label>
      <input type="text" value={expenses} onChange={handleExpenses} />

      <label>🤼‍♂️ {friend.name}'s expenses:</label>
      <input type="text" disabled value={friendExpenses} />

      <label>🤑 Who is paying the bill?</label>
      <select value={buyer} onChange={(e) => setBuyer(e.target.value)}>
        <option value={'you'}>You</option>
        <option value={'friend'}>{friend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
export default App;
