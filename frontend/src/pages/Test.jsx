import React, { useState } from "react";
import { IconButton } from "@material-tailwind/react";

export const Test = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  return (
    <section className="p-4">
      <div className="mx-auto max-w-screen-lg ">
        <div class="relative inline-block">
          <IconButton
            variant="text"
            data-popover-target="notifications-menu"
            class="rounded-md border border-transparent p-2.5 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={handleOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-4 h-4 pointer-events-none"
            >
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          </IconButton>

          <ul
            role="menu"
            data-popover="notifications-menu"
            data-popover-placement="bottom"
            className={`${
              open
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 pointer-events-none"
            } absolute left-1/2 transform -translate-x-1/2 mt-2 z-10 w-[300px] overflow-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg shadow-sm focus:outline-none transition-all duration-200 ease-in-out origin-top`}
          >
            <li
              role="menuitem"
              class="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
            >
              <img
                alt="tania andrew"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                class="relative inline-block h-10 w-10 rounded-full object-cover object-center"
              />
              <div class="flex flex-col gap-1 ml-4">
                <p class="text-slate-800 font-medium">
                  Tania send you a message
                </p>
                <p class="text-slate-500 text-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-4 h-4 mr-1 text-slate-400"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  13 minutes ago
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
