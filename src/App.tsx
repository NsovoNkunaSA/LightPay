import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

type Transfer = {
  id: string
  recipient: string
  phone: string
  amount: number
  direction: 'sent' | 'received'
  status: 'completed' | 'pending'
  createdAt: string
}

type Summary = {
  balance: number
  currency: string
  network: string
}

const fallbackActivity: Transfer[] = [
  { id: 'tx-1', recipient: 'Amina Yusuf', phone: '+234 803 442 1180', amount: 48, direction: 'sent', status: 'completed', createdAt: '2026-11-05T09:41:00Z' },
  { id: 'tx-2', recipient: 'Daniel Okafor', phone: '+234 812 771 9024', amount: 125, direction: 'received', status: 'completed', createdAt: '2026-11-05T08:18:00Z' },
  { id: 'tx-3', recipient: 'Mama’s Kitchen', phone: '+234 809 315 6042', amount: 16.5, direction: 'sent', status: 'pending', createdAt: '2026-11-04T17:32:00Z' },
  { id: 'tx-4', recipient: 'Chidi Nwosu', phone: '+234 706 098 4221', amount: 32, direction: 'received', status: 'completed', createdAt: '2026-11-04T12:06:00Z' },
]

const fallbackSummary: Summary = { balance: 2840.5, currency: 'USDT', network: 'Demo network' }

function Icon({ name }: { name: 'grid' | 'arrow' | 'clock' | 'settings' | 'plus' | 'send' | 'download' | 'more' | 'close' | 'check' | 'wallet' }) {
  const paths: Record<typeof name, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    arrow: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z" transform="translate(-1 -1) scale(.96)" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    send: <><path d="m21 3-7.5 18-3.5-7-7-3.5L21 3Z" /><path d="M10 14 21 3" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M5 17v4h14v-4" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    wallet: <><rect x="3" y="5" width="18" height="15" rx="2" /><path d="M3 9h18m-5 5h.01" /><path d="M6 5V3h12v2" /></>,
  }

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function App() {
  const [summary, setSummary] = useState(fallbackSummary)
  const [activity, setActivity] = useState(fallbackActivity)
  const [activePage, setActivePage] = useState<'overview' | 'activity'>('overview')
  const [sendOpen, setSendOpen] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/summary').then((response) => response.ok ? response.json() as Promise<Summary> : Promise.reject()),
      fetch('/api/activity').then((response) => response.ok ? response.json() as Promise<Transfer[]> : Promise.reject()),
    ]).then(([nextSummary, nextActivity]) => {
      setSummary(nextSummary)
      setActivity(nextActivity)
    }).catch(() => undefined)
  }, [])

  async function submitTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    setNotice('')
    try {
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, phone, amount: Number(amount) }),
      })
      const result = await response.json() as { transfer?: Transfer; summary?: Summary; error?: string }
      if (!response.ok || !result.transfer || !result.summary) throw new Error(result.error ?? 'Transfer could not be completed.')
      setActivity((current) => [result.transfer!, ...current])
      setSummary(result.summary)
      setNotice(`Sent ${Number(amount).toFixed(2)} USDT to ${recipient}.`)
      setRecipient('')
      setPhone('')
      setAmount('')
      setSendOpen(false)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reach the payment service.')
    } finally {
      setSending(false)
    }
  }

  const visibleActivity = activePage === 'activity' ? activity : activity.slice(0, 4)

  return (
    <div className="app-shell">
      <aside className="sidebar">
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
          <button className="nav-item settings-item" onClick={() => setNotice('Account settings will be available after kickoff.')}><Icon name="settings" />Settings</button>
          <div className="profile-row"><div className="profile-avatar">JS</div><span><b>Nsovo Nkuna</b><small>Personal account</small></span><Icon name="more" /></div>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb"><span>Wallet</span><span className="crumb-slash">/</span><b>{activePage === 'overview' ? 'Overview' : 'Activity'}</b></div>
          <div className="topbar-right"><span className="demo-chip"><span />DEMO MODE</span><button className="icon-button top-avatar" aria-label="Nsovo Nkuna account">JS</button></div>
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
              <div className="balance-value">{summary.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span>USDT</span></div>
              <div className="balance-caption">Tether USD · Demo balance</div>
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

          <section className="activity-section">
            <div className="section-heading"><div><p className="eyebrow">YOUR MONEY IN MOTION</p><h2>{activePage === 'overview' ? 'Recent activity' : 'All transactions'} <span className="count-badge">{activity.length}</span></h2></div>{activePage === 'overview' && <button className="text-button" onClick={() => setActivePage('activity')}>View all <span>→</span></button>}</div>
            <div className="activity-table">
              <div className="table-head"><span>NAME / PHONE</span><span>DATE</span><span>STATUS</span><span className="amount-heading">AMOUNT</span></div>
              {visibleActivity.map((item) => <div className="transaction-row" key={item.id}>
                <div className="transaction-person"><div className={`transaction-avatar avatar-${item.id.length % 4}`}>{item.recipient.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><span><b>{item.recipient}</b><small>{item.phone}</small></span></div>
                <div className="transaction-date">{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}<small>{new Date(item.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</small></div>
                <div><span className={`transaction-status ${item.status}`}>{item.status === 'completed' ? 'Completed' : 'Pending'}</span></div>
                <div className={`transaction-amount ${item.direction}`}>{item.direction === 'sent' ? '−' : '+'}{item.amount.toFixed(2)} <span>USDT</span></div>
              </div>)}
              {visibleActivity.length === 0 && <div className="empty-activity">Your first payment will show up here.</div>}
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
    </div>
  )
}

export default App
