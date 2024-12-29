import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signOutSuccess } from '../redux/user/userSlice';

export default function Header() {
    const { currentUser } = useSelector((state) => state.user)
    const themeSelected = useSelector((state) => state.theme)
    const dispatch = useDispatch()
    const location = useLocation().pathname

    const handleSignOut = async () => {
        try {
            const respose = await fetch('/api/user/signout', {
                method: 'POST',
            }
            )
            const data = await respose.json()
            console.log(data, 'check data')
            if (!respose.ok) {
                console.log(data.message)
            }
            else {
                dispatch(signOutSuccess())
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <Navbar className='border-b-2'>
            <Link
                to='/'
                className='self-center whitespace-nowrap sm:text-xl font-semibold dark:text-white'
            >
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                    Anuraag's
                </span>
                Blog
            </Link>
            <form>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                />
            </form>
            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch />
            </Button>
            <div className='flex gap-2 md:order-2'>
                <Button
                    className='w-12 h-10 hidden sm:inline'
                    color='gray'
                    pill
                    onClick={() => dispatch(toggleTheme())}
                >
                    {themeSelected.theme === 'light' ? <FaSun /> : <FaMoon />
                    }
                </Button>
                {
                    currentUser ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt='user'
                                    img={currentUser.profilePicture}
                                    rounded
                                />
                            }
                        >
                            <Dropdown.Header>
                                <span className='block text-sm'>@{currentUser.username}</span>
                                <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to={'dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
                        </Dropdown>)
                        : (
                            <Link to='sign-in'>
                                <Button gradientDuoTone='purpleToBlue' outline>
                                    Sign In
                                </Button>
                            </Link>)
                }
                <Navbar.Toggle></Navbar.Toggle>
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={location == "/"} as={'div'}>
                    <Link to='/'>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={location == "/about"} as={'div'}>
                    <Link to='/about'>About</Link>
                </Navbar.Link>
                <Navbar.Link active={location == "/projects"} as={'div'}>
                    <Link to='/projects'>Projects</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}