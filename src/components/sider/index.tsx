
import { createState, createEffect, SetStateFunction, State } from "solid-js";
import { createSignal, onCleanup, Component } from "solid-js";
import { For } from "solid-js";
// @ts-ignore
import Image from "../../assets/images/img.png";
// @ts-ignore
import Settings from "../../assets/icons/settings.svg";
// @ts-ignore
import Share from "../../assets/icons/share.svg";
// @ts-ignore
import Arrow from "../../assets/icons/arrow-right.svg";
import SvgIcon from "../SvgIcon";
import Wrapper from './styles';
import { Socket, Presence } from "phoenix"


const Sider = () => {

  let socket = new Socket("ws://localhost:4090/socket", {})
  socket.connect()
  let channel = socket.channel("editors:slug", {})
  channel.join()
    .receive("ok", (response: any) => { console.log("Joined successfully", response) })

  const [state, setState] = createState({ users: [] });
  let presences = {}
  channel.on('presence_state', (state: any) => {
    presences = Presence.syncState(presences, state)
    setState("users", toUsers(presences));
    console.log(presences)

  })

  channel.on('presence_diff', (diff: any) => {
    presences = Presence.syncDiff(presences, diff)
    setState("users", toUsers(presences));
    console.log(presences)
  })

  function toUsers(presences: any) {
    const listBy = (name: string | number, { metas: [first, ...rest] }: any) => {

      return { name: name, online_at: first.online_at, ref: first.phx_ref }
    }
    return Presence.list(presences, listBy)
  }

  return (
    <Wrapper>
      <div>
        <div className="draft">
          {/* {count()} */}
          Draft
        </div>
      </div>
      <div className="users--count">
        {/* <For each={[0, 1, 2]}>
          {() => (
            <div className="img">
              <img src={Image} />
            </div>
          )}
        </For> */}
        <For each={state.users}>
          {(user, i) => {
            console.log("user")
            console.log(user)
            const { name, online_at, ref } = user;

            return (
              <div className="img">

                <img src={Image} />
              </div>
            );
          }}
        </For>


      </div>
      {/* <div className="img-wrapper avatar">
        <div className="img">
          <img src={Image} />
        </div>
      </div> */}

      {/* <div className="actions--bottom">
        <div>{SvgIcon(Share)}</div>
        <div>{SvgIcon(Settings)}</div>
        <div className="arrow">{SvgIcon(Arrow)}</div>
      </div> */}
    </Wrapper>
  );
};

export default Sider;
