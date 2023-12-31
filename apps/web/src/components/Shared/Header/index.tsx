"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import pseudoJudgeLogo from "../../../../public/assets/images/logo1.png";
import { usePathname, useRouter } from "next/navigation";
import headerData from "../../../../public/assets/data/headerdata";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isLoginQuery, logoutMutation } from "@/lib/tanstackQuery/api/authApi";
import { useDispatch } from "@/lib/redux";
import { authSlice, selectAuth } from "@/lib/redux/slices/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
import { toast } from "sonner";
import { useSelector } from "react-redux";

const HeaderUser = ({ data }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: logoutMutation,
  });

  const handleLogout = () => {
    toast.promise(mutation.mutateAsync(), {
      loading: "Logging out...",
      success: () => {
        dispatch(authSlice.actions.logoutAuthData());
        router.push("/login");
        return "Logout successfully";
      },
      error: "Failed to logout",
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
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>
              <Link href="/settings">Settings</Link>
            </span>
          </DropdownMenuItem>
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

const Header = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  const pathname = usePathname();

  const { data, isSuccess } = useQuery({
    queryKey: ["isLogin", pathname],
    queryFn: isLoginQuery,
    retry: false,
    refetchOnMount: true,
  });

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
        className={`fixed top-0 left-auto right-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full text-sm sm:py-0 backdrop-blur transition-colors duration-500 bg-slate-50/50 border-b`}
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
              as={"image"}
            >
              <Image
                priority={true}
                src={pseudoJudgeLogo}
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
                .filter((item) =>
                  (!auth?.isLogin && item.path === "/problems") ||
                  (!auth?.isLogin && item.path === "/groups")
                    ? false
                    : true
                )
                .map((item) => {
                  const { path } = item;
                  const isActive = path === pathname ?? false;

                  return (
                    <Link
                      key={item.key}
                      className={`font-medium sm:py-6 ${
                        isActive
                          ? "text-blue-500 hover:text-blue-600"
                          : "text-gray-500 hover:text-blue-600"
                      }  `}
                      href={item.path}
                      aria-current="page"
                    >
                      {item.name}
                    </Link>
                  );
                })}

              <div>{content}</div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
