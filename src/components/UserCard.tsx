import { Transition } from "solid-transition-group";

type UserCardProps = {
  name: string;
};

export const UserCard = (props: UserCardProps) => (
  <Transition
    onEnter={(el, done) => {
      const a = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600 });
      a.finished.then(done);
    }}
  >
    <div class="p-2 bg-white rounded-lg shadow hover:shadow-md justify-start items-center gap-2 flex transition-height ease-in duration-500">
      <div
        class="w-6 h-6 rounded-full justify-center items-center flex"
        style={{ "background-color": "var(--card-color-1)" }}
      >
        <img class="w-5 h-5" src={`/avatars/${props.name}.png`} />
      </div>
      <div class="text-black text-xs cursor-default">
        Anonymous {props.name}
      </div>
    </div>
  </Transition>
);
