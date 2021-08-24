import { createSignal } from "solid-js"

function App() {
    const [created, setCreated] = createSignal([])
    const [valid, setValid] = createSignal(false)

    const regex = new RegExp("^(?:(?:https?|ftp)://)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z{00a1}{ffff}0-9]+-?)*[a-z{00a1}{ffff}0-9]+)(?:\.(?:[a-z{00a1}{ffff}0-9]+-?)*[a-z{00a1}{ffff}0-9]+)*(?:\.(?:[a-z{00a1}{ffff}]{2,})))(?::\d{2,5})?(?:/[^\s]*)?$")

    let url
    const key = "1234"

    const registerUrl = (e) => {
        e.preventDefault()
        setCreated([...created(), "mzf.one/" + key])
        console.log(created())
    }

    return (
        <div>
            <p>Hello tailwind!</p>
            <form onSubmit={registerUrl}>
                <input type="text" ref={url} onChange={e => setValid(false)}/>
                <input type="submit" value="Shorten URL" />
            </form>

            <ul>
                {created().map(i => (<a><li>{i}</li></a>))}
            </ul>
            
        </div>
    );
}

export default App