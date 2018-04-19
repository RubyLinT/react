import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { DatePicker, Button, Layout } from 'antd';
import Friend from './component/friend/friend';
import Login from './component/login/login';
import Setting from './component/setting/setting'
import {
  Router, Route, IndexRoute, hashHistory, Link,
  Redirect, IndexRedirect, browserHistory, IndexLink,
  onlyActiveOnIndex
} from 'react-router';
import Home from './component/home/home';
import LeftMenu from './component/layoutCPT/leftMenu/leftMenu';
import TopHeader from './component/layoutCPT/topHeader/topHeader';
import { CookiesProvider } from 'react-cookie';
import Regist from './component/regist/regist';
import ForgetPwd from './component/forgetPwd';
import Notice from './component/Notice/notice';
import Chat from './component/chat/chat';
import Game from './component/game'
import Mail from './component/Mail';
import UserTable from './component/userTable'
import AddFriend from './component/addFriend';
import AddTable from './component/addTable';
import FriendDetail from './component/friendDetail'
const { Header, Footer, Sider, Content } = Layout;
function App(props) {
  return (
    <div className="container">
      {/* <h1>AntDesign Demo</h1>
      <Link to="/" activeStyle={{color:'red'}} onlyActiveOnIndex>TO HOME</Link><br />
      <IndexLink to="/" activeClassName="active">to home</IndexLink><br />
      <Link to="/Login" activeStyle={{color:'blue'}}>TO LOGIN</Link><br />
      <Link to="/Friend" activeClassName="active">TO Friend</Link><br />
      <span onClick={() => {
        hashHistory.push('/Login')
      }}>to login</span>
        <h1>AntDesign Demo</h1>
        <hr /><br />
        <DatePicker />
        <Friend />
        <Login title="登陆"/>
        <a href="/#/Login">to login</a>
        {props.children} */}
      <Layout>
        <Sider>
          <LeftMenu></LeftMenu>
        </Sider>
        <Layout>
          <Header>
            <TopHeader></TopHeader>
          </Header>
          <Content>
            {props.children}
          </Content>
          {/* <Footer>Footer</Footer> */}
        </Layout>
      </Layout>
    </div>
  );
}

ReactDOM.render((
  <CookiesProvider>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        {/* <IndexRedirect to="/Friend"></IndexRedirect>    */}
        <Route path="" component={Home}></Route>
        <Route path="Setting" component={Setting}></Route>
        <Route path="Notice" component={Notice}></Route> 
        <Route path="Chat/:name" component={Chat}></Route>
        <Route path="Mail/:name" component={Mail}></Route>
        <Route path="Game" component={Game}></Route>
        <Route path="Table" component={UserTable}></Route>
        <Route path="AddFriend" component={AddFriend}></Route>
        <Route path="AddTable" component={AddTable}></Route>
        <Route path="FriendDetail/:name" component={FriendDetail}></Route>
        <Route path="Friend" component={Friend}
        // onEnter={
        //   ({params},replace) => replace('Login')
        // }
        ></Route>
        {/* <Redirect from="Friend" to="Login"></Redirect> */}
      </Route>
      <Route path="Login" component={Login}></Route>     
      <Route path="Regist" component={Regist}></Route>     
      <Route path="ForgetPwd" component={ForgetPwd}></Route>          
    </Router>
  </CookiesProvider>
), document.getElementById('root'));
