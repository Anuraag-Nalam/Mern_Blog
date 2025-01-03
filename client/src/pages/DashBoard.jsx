import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashPosts from '../components/DashPosts'
import DashUsers from '../components/DashUsers'
import DashComments from './DashComments'
import DashboardComp from '../components/DashComponent'

const DashBoard = () => {
    const location = useLocation()
    const [tab, setTab] = useState('')
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        console.log(urlParams)
        const tabFromUrl = urlParams.get('tab')
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
    }, [location.search])
    return (
        <div className='min-h-screen flex md:flex-row'>
            <div className='md:w-56'>
                <DashSidebar />
            </div>
            {tab === 'comments' && <DashComments />}
            {tab === 'profile' && <DashProfile />}
            {tab === 'posts' && <DashPosts />}
            {tab === 'users' && <DashUsers />}
            {tab === 'dash' && <DashboardComp />}
        </div>
    )
}

export default DashBoard
