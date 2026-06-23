import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';

import Home from "./pages/Home";
import Books from "./pages/Books";
import Authors from "./pages/Authors";
import BookDetail from "./pages/BookDetail";
import AuthorDetail from "./pages/AuthorDetail";
import Favorites from './pages/Favorites';
import TakenBooks from './pages/TakenBooks';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreateOrderByReader from './pages/CreateOrderByReader';
import CreateOrderByLibrarian from './pages/CreateOrderByLibrarian';
import EditProfile from './pages/EditProfile';
import OrderSuccess from './pages/OrderSuccess';
import Readers from './pages/Readers';
import ReaderDetail from './pages/ReaderDetail';
import CreateBook from './pages/CreateBook';
import CreateAuthor from './pages/CreateAuthor';
import AuthorSuccess from './pages/AuthorSuccess';
import BookSuccess from './pages/BookSuccess';
import ResetPassword from './pages/ResetPassword';
import EditBook from './pages/EditBook';
import EditAuthor from './pages/EditAuthor';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetail />} />

        <Route path="/authors" element={<Authors />} />
        <Route path="/authors/:id" element={<AuthorDetail />} />

        <Route path="/favorites" element={<Favorites />} />
        <Route path="/taken-books" element={<TakenBooks />} />

        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />

        <Route path="/create-order/:id" element={<CreateOrderByReader />} />
        <Route path="/create-order-librarian" element={<CreateOrderByLibrarian />} />

        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="/readers" element={<Readers />} />
        <Route path="/readers/:id" element={<ReaderDetail />} />

        <Route path="/create-book" element={<CreateBook />} />
        <Route path="/create-author" element={<CreateAuthor />} />

        <Route path="/book-success" element={<BookSuccess />} />
        <Route path="/author-success" element={<AuthorSuccess />} />

        <Route path="/edit-book/:id" element={<EditBook />} />
        <Route path="/edit-author/:id" element={<EditAuthor />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;