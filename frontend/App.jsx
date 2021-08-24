import { createSignal } from "solid-js"

function App() {
    const [created, setCreated] = createSignal([])
    const [valid, setValid] = createSignal(false)

    let url
    let key

    const registerUrl = (e) => {
        e.preventDefault()
        setCreated([...created, "https://mzf.one/" + key.value])

    }

    return (
      <div>
        <form onSubmit={registerUrl}>
            <input type="text" ref={url} />
            <input type="text" ref={key} />
            <input type="submit" value="Create Shortened URL" />
        </form>

        <div>
            <ul>
                {created.map(_url => <li>{_url}</li>)}
            </ul>
        </div>
      </div>
    );
  }
  
  export default App;