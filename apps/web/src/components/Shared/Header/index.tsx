"use client";

import Link from "next/link";
import { useEffect, useState, Fragment } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDispatch } from "@/lib/redux";
import { authSlice, selectAuth } from "@/lib/redux/slices/authSlice";
import { isLoginQuery, logoutMutation } from "@/lib/tanstackQuery/api/authApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import darkLogo from "../../../../public/assets/images/dark-logo.png";
import whiteLogo from "../../../../public/assets/images/white-logo.png";
import headerData from "../../../../public/assets/data/headerdata";

import { LogOut, Settings, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AxiosError } from "axios";
import { useRouter } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import errorFn from "../Error";

import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

import { Menu, Transition } from "@headlessui/react";

import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { ModeToggle } from "./ModeToggle";

const HeaderUser = ({ data }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: logoutMutation,
  });

  const auth = useSelector(selectAuth);

  const queryClient = useQueryClient();

  const handleLogout = () => {
    toast.promise(mutation.mutateAsync(), {
      loading: "Logging out...",
      success: () => {
        dispatch(authSlice.actions.logoutAuthData());
        router.push("/login");
        queryClient.invalidateQueries({
          queryKey: ["group", "problems", auth.userId],
        });
        return "Logout successfully";
      },
      error: (err: AxiosError) => {
        return errorFn(err);
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar>
          <AvatarImage
            loading="lazy"
            src={data.imageUrl}
            alt={data.username}
            width={140}
            height={140}
          />
          <AvatarFallback>
            {data.fullName.match(/\b\w/g).join("")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-center capitalize">
          {data.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(`/user/${data.username}`)}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          {auth?.role !== "user" && (
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>
                <Link href="/settings">Settings</Link>
              </span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const { theme } = useTheme();

  const pathname = usePathname();

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["isLogin", pathname],
    });
  }, [pathname, queryClient]);

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["isLogin", pathname],
    queryFn: isLoginQuery,
    retry: false,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (isError) {
      dispatch(authSlice.actions.logoutAuthData());
    }
  }, [isError, dispatch]);

  let content = (
    <Link href="/login">
      <Button>Login</Button>
    </Link>
  );
  if (isSuccess) {
    content = <HeaderUser data={data} />;
  }

  useEffect(() => {
    if (isSuccess) {
      const { _id, ...rest } = data;
      dispatch(
        authSlice.actions.loginAuthData({
          userId: _id,
          isLogin: true,
          ...rest,
        })
      );
    }
  }, [data, dispatch, isSuccess]);

  return (
    <>
      <header
        className={`fixed top-0 left-auto right-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full text-sm sm:py-0 backdrop-blur transition-colors duration-500  border-b`}
      >
        <nav
          className="relative container w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-3 py-2"
          aria-label="Global"
        >
          <div className="flex items-center justify-between">
            <Link
              className="flex-none text-xl font-semibold"
              href="/"
              aria-label="Brand"
            >
              <Image
                priority={true}
                src={theme === "light" ? whiteLogo : darkLogo}
                width="0"
                height="0"
                sizes="(min-width: 1200px) 3vw, (min-width: 1024px) 7vw, (min-width:425px) 9vw, 17vw"
                className="w-full h-auto"
                alt="psuedojudge logo"
              />
            </Link>
            <div className="sm:hidden">
              <button
                type="button"
                className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm "
                data-hs-collapse="#navbar-collapse-with-animation"
                aria-controls="navbar-collapse-with-animation"
                aria-label="Toggle navigation"
              >
                <svg
                  className="hs-collapse-open:hidden w-4 h-4"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                  />
                </svg>
                <svg
                  className="hs-collapse-open:block hidden w-4 h-4"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </div>
          </div>
          <div
            id="navbar-collapse-with-animation"
            className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
          >
            <div className="flex flex-col gap-y-4 gap-x-0 mt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-y-0 sm:gap-x-7 sm:mt-0 sm:pl-7">
              {headerData
                // .filter((item) =>
                //   (!auth?.isLogin && item.path === "/problems") ||
                //   (!auth?.isLogin && item.path === "/groups")
                //     ? false
                //     : true
                // )
                .map((item) => {
                  const { path } = item;
                  const isActive = path === pathname ?? false;

                  return (
                    <Link
                      key={item.key}
                      className={`font-medium sm:py-6 ${
                        isActive
                          ? "text-blue-500 hover:text-blue-600"
                          : "text-muted-foreground hover:text-blue-600"
                      }  `}
                      href={item.path}
                      aria-current="page"
                    >
                      {item.name}
                    </Link>
                  );
                })}
              <div>
                <ModeToggle />
              </div>
              <div>{content}</div>
            </div>
          </div>
        </nav>
      </header>

      {/* <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form className="relative flex flex-1" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <MagnifyingGlassIcon
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              placeholder="Search..."
              type="search"
              name="search"
            />
          </form>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div
              className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              aria-hidden="true"
            />

            <Menu as="div" className="relative">
              <Menu.Button className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full bg-gray-50"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <span className="hidden lg:flex lg:items-center">
                  <span
                    className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                    aria-hidden="true"
                  >
                    Tom Cook
                  </span>
                  <ChevronDownIcon
                    className="ml-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <a
                          href={item.href}
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-gray-900"
                          )}
                        >
                          {item.name}
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Header;
