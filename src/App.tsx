        <a className="brand" href="#overview" onClick={() => setActivePage('overview')} aria-label="LightPay home">
          <span className="brand-mark"><span /></span><span>lightpay</span>
        </a>
        <div className="workspace-label">YOUR WALLET</div>
        <nav className="side-nav" aria-label="Main navigation">
          <button className={activePage === 'overview' ? 'nav-item active' : 'nav-item'} onClick={() => setActivePage('overview')}><Icon name="grid" />Overview</button>
          <button className="nav-item" onClick={() => setSendOpen(true)}><Icon name="arrow" />Send money</button>
          <button className={activePage === 'activity' ? 'nav-item active' : 'nav-item'} onClick={() => setActivePage('activity')}><Icon name="clock" />Activity</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="network-status"><span className="status-dot" /><span><b>USDT wallet</b><small>Demo mode</small></span><Icon name="more" /></div>
          <button className="nav-item settings-item" onClick={() => setSettingsOpen(true)}><Icon name="settings" />Settings</button>
          <button className="profile-row profile-edit-trigger" onClick={() => setProfileOpen(true)}><div className="profile-avatar">{profileName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><span><b>{profileName}</b><small>Personal account · Edit profile</small></span><Icon name="more" /></button>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb"><span>Wallet</span><span className="crumb-slash">/</span><b>{activePage === 'overview' ? 'Overview' : 'Activity'}</b></div>
          <div className="topbar-right"><span className="demo-chip"><span />DEMO MODE</span><button className="icon-button top-avatar" aria-label={`${profileName} account`}>{profileName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</button></div>
        </header>

        <div className="content-wrap">
          <section className="welcome-row">
            <div><p className="eyebrow">THURSDAY, NOVEMBER 5, 2026</p><h1>{activePage === 'overview' ? 'Good morning, Nsovo' : 'Your activity'}</h1><p className="subheading">{activePage === 'overview' ? 'Your money, moving at the speed of life.' : 'Every payment, all in one place.'}</p></div>
            <button className="primary-button desktop-send" onClick={() => setSendOpen(true)}><Icon name="send" />Send money</button>
          </section>

          {notice && <div className="notice" role="status"><Icon name="check" />{notice}<button className="notice-close" aria-label="Dismiss message" onClick={() => setNotice('')}><Icon name="close" /></button></div>}

          {activePage === 'overview' && <section className="overview-grid" aria-label="Wallet overview">
            <article className="balance-panel">
              <div className="balance-heading"><span>AVAILABLE BALANCE</span><span className="balance-network"><span />{summary.network}</span></div>
              <div className="balance-value">{summary.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span>{currency}</span></div>
              <div className="balance-caption">Wallet balance · Demo balance</div>
              <div className="balance-divider" />
              <div className="balance-actions"><button onClick={() => setNotice('Cash-in options will be configured with the kickoff resources.')}><Icon name="plus" />Add money</button><button onClick={() => setSendOpen(true)}><Icon name="send" />Send</button><button onClick={() => setNotice('Your demo wallet statement is being prepared.')}><Icon name="download" />Request</button></div>
              <div className="balance-art" aria-hidden="true"><i /><i /><i /></div>
            </article>

            <article className="transfer-panel">
              <div className="panel-heading"><div><p className="eyebrow">MOVE MONEY</p><h2>Send to anyone</h2></div><div className="send-icon"><Icon name="send" /></div></div>
              <p className="transfer-copy">Pay a person using their mobile number. No bank details needed.</p>
              <button className="recipient-entry" onClick={() => setSendOpen(true)}><span className="recipient-plus"><Icon name="plus" /></span><span><b>Who are you paying?</b><small>Phone number or contact</small></span><span className="entry-arrow">→</span></button>
              <div className="transfer-foot"><span className="secure-icon">✳</span>Fast, simple peer-to-peer payments</div>
            </article>
          </section>}

          {activePage === 'overview' && <section className="quick-send-section" aria-labelledby="quick-send-title">
            <div className="quick-send-heading"><div><p className="eyebrow">PEER-TO-PEER</p><h2 id="quick-send-title">Quick send</h2></div></div>
            <div className="contact-list">
              {quickContacts.map((contact) => <button className="contact-button" key={contact.phone} onClick={() => startQuickSend(contact)}>
                <span className={`transaction-avatar avatar-${contact.id.length % 4}`}>{contact.recipient.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
                <span className="contact-details"><b>{contact.recipient}</b><small>{contact.phone}</small></span>
                <span className="contact-arrow" aria-hidden="true">→</span>
              </button>)}
              {quickContacts.map((contact) => <button className="contact-edit-button" key={`edit-${contact.phone}`} onClick={() => openContactEditor(contact)}>Edit {contact.recipient}</button>)}
            </div>
          </section>}

          <section className="activity-section">
            <div className="section-heading"><div><p className="eyebrow">YOUR MONEY IN MOTION</p><h2>{activePage === 'overview' ? 'Recent activity' : 'All transactions'} <span className="count-badge">{activity.length}</span></h2></div>{activePage === 'overview' && <button className="text-button" onClick={() => setActivePage('activity')}>View all <span>→</span></button>}</div>
            {activePage === 'activity' && <div className="activity-controls">
              <input aria-label="Search transactions" value={activitySearch} onChange={(event) => setActivitySearch(event.target.value)} placeholder="Search name or phone" />
              <select aria-label="Filter transactions" value={activityFilter} onChange={(event) => setActivityFilter(event.target.value as 'all' | 'sent' | 'received')}>
                <option value="all">All transactions</option>
                <option value="sent">Sent</option>
                <option value="received">Received</option>
              </select>
            </div>}
            <div className="activity-table">
              <div className="table-head"><span>NAME / PHONE</span><span>DATE</span><span>STATUS</span><span className="amount-heading">AMOUNT</span></div>
              {visibleActivity.map((item) => <div className="transaction-row" key={item.id} onClick={() => setSelectedTransaction(item)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') setSelectedTransaction(item) }}>
                <div className="transaction-person"><div className={`transaction-avatar avatar-${item.id.length % 4}`}>{item.recipient.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><span><b>{item.recipient}</b><small>{item.phone}</small></span></div>
                <div className="transaction-date">{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}<small>{new Date(item.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</small></div>
                <div><span className={`transaction-status ${item.status}`}>{item.status === 'completed' ? 'Completed' : 'Pending'}</span></div>
                <div className={`transaction-amount ${item.direction}`}>{item.direction === 'sent' ? '−' : '+'}{item.amount.toFixed(2)} <span>USDT</span></div>
              </div>)}
              {visibleActivity.length === 0 && <div className="empty-activity">{activity.length === 0 ? 'Your first payment will show up here.' : 'No transactions match your search.'}</div>}
            </div>
          </section>

          <footer className="page-foot"><span><span className="footer-dot" />Payments are simulated in this preview</span><span>Built for mobile money</span></footer>
        </div>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <button className={activePage === 'overview' ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => setActivePage('overview')}><Icon name="grid" /><span>Home</span></button>
        <button className="mobile-nav-item" onClick={() => setSendOpen(true)}><Icon name="send" /><span>Send</span></button>
        <button className={activePage === 'activity' ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => setActivePage('activity')}><Icon name="clock" /><span>Activity</span></button>
      </nav>

      {sendOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSendOpen(false) }}>
        <section className="send-modal" role="dialog" aria-modal="true" aria-labelledby="send-title">
          <div className="modal-heading"><div><p className="eyebrow">PEER-TO-PEER</p><h2 id="send-title">Send money</h2></div><button className="icon-button close-button" aria-label="Close" onClick={() => setSendOpen(false)}><Icon name="close" /></button></div>
          <p className="modal-description">Send USDT to a mobile number. This demo does not initiate a blockchain transfer.</p>
          <form onSubmit={submitTransfer}>
            <label htmlFor="recipient-name">Recipient name</label><input id="recipient-name" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="e.g. Amina Yusuf" required maxLength={70} />
            <label htmlFor="recipient-phone">Mobile number</label><input id="recipient-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+234 800 000 0000" required maxLength={24} />
            <label htmlFor="transfer-amount">Amount</label><div className="amount-input"><input id="transfer-amount" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" min="0.01" max={summary.balance} step="0.01" required /><span>USDT</span></div>
            <div className="fee-line"><span>Network fee</span><b>0.00 USDT <small>Demo</small></b></div>
            <button className="primary-button modal-submit" type="submit" disabled={sending}>{sending ? 'Sending…' : `Send${amount ? ` ${Number(amount).toFixed(2)} USDT` : ' USDT'}`}<Icon name="arrow" /></button>
          </form>
        </section>
      </div>}

      {profileOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setProfileOpen(false) }}>
        <section className="send-modal management-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title">
          <div className="modal-heading"><div><p className="eyebrow">ACCOUNT</p><h2 id="profile-title">Edit profile</h2></div><button className="icon-button close-button" onClick={() => setProfileOpen(false)} aria-label="Close"><Icon name="close" /></button></div>
          <form onSubmit={saveProfile}><label htmlFor="profile-name">Full name</label><input id="profile-name" value={profileName} onChange={(event) => setProfileName(event.target.value)} required maxLength={70} /><label htmlFor="profile-email">Email address</label><input id="profile-email" type="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} placeholder="you@example.com" /><button className="primary-button modal-submit" type="submit">Save profile</button></form>
        </section>
      </div>}

      {settingsOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false) }}>
        <section className="send-modal management-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <div className="modal-heading"><div><p className="eyebrow">PREFERENCES</p><h2 id="settings-title">Wallet settings</h2></div><button className="icon-button close-button" onClick={() => setSettingsOpen(false)} aria-label="Close"><Icon name="close" /></button></div>
          <form onSubmit={saveSettings}><label htmlFor="wallet-currency">Display currency</label><select id="wallet-currency" value={currency} onChange={(event) => setCurrency(event.target.value)}><option value="USDT">USDT</option><option value="USD">USD</option><option value="ZAR">ZAR</option><option value="NGN">NGN</option></select><label htmlFor="wallet-network">Network label</label><input id="wallet-network" value={network} onChange={(event) => setNetwork(event.target.value)} required maxLength={40} /><p className="modal-description">Currency changes here only change the wallet label; no exchange-rate conversion occurs. Transfers and transaction records remain in USDT.</p><button className="primary-button modal-submit" type="submit">Save settings</button></form>
        </section>
      </div>}

      {editingContact && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditingContact(null) }}>
        <section className="send-modal management-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
          <div className="modal-heading"><div><p className="eyebrow">SAVED CONTACT</p><h2 id="contact-title">Edit contact</h2></div><button className="icon-button close-button" onClick={() => setEditingContact(null)} aria-label="Close"><Icon name="close" /></button></div>
          <form onSubmit={saveContact}><label htmlFor="contact-name">Recipient name</label><input id="contact-name" value={contactName} onChange={(event) => setContactName(event.target.value)} required maxLength={70} /><label htmlFor="contact-phone">Mobile number</label><input id="contact-phone" value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} required maxLength={24} /><button className="primary-button modal-submit" type="submit">Save contact</button></form>
        </section>
      </div>}

      {selectedTransaction && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedTransaction(null) }}>
