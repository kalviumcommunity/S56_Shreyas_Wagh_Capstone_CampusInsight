import React from 'react';
import './Styles/Middle.css';

function Middle() {
  return (
    <div className="messege-feed">
      <div className="feed">
        <div className="messege">
          <div>
            <div className="user-info">
              <span className="display-name">User Display Name</span>
              <span className="username">@username</span>
              <span className="timestamp">12m ago</span>
            </div>
            <p>This is a sample messege! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec justo mauris.</p>
          </div>
        </div>
           <div className="messege">
          <div>
            <div className="user-info">
              <span className="display-name">User Display Name</span>
              <span className="username">@username</span>
              <span className="timestamp">12m ago</span>
            </div>
            <p>This is a sample messege! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec justo mauris.</p>
          </div>
        </div>
           <div className="messege">
          <div>
            <div className="user-info">
              <span className="display-name">User Display Name</span>
              <span className="username">@username</span>
              <span className="timestamp">12m ago</span>
            </div>
            <p>This is a sample messege! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec justo mauris.</p>
          </div>
        </div>
           <div className="messege">
          <div>
            <div className="user-info">
              <span className="display-name">User Display Name</span>
              <span className="username">@username</span>
              <span className="timestamp">12m ago</span>
            </div>
            <p>This is a sample messege! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec justo mauris.</p>
          </div>
        </div>
        <div className="messege">
          <div>
            <div className="user-info">
              <span className="display-name">Another User</span>
              <span className="username">@anotheruser</span>
              <span className="timestamp">1h ago</span>
            </div>
            <p>Another sample messege! Sed vehicula ipsum non elit dignissim, a commodo libero dapibus. Donec suscipit libero et eros luctus, eget aliquet risus feugiat.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Middle;
