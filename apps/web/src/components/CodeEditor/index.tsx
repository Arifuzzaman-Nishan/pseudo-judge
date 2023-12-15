"use client";

import React from "react";
import DropDown, { TextareaComponent } from "./DropDown";
import Editor from "@monaco-editor/react";
import { Button } from "../ui/button";

const CodeEditor = () => {
  return (
    <section className="h-screen flex flex-col">
      <div className="mx-auto h-full w-full overflow-y-hidden ">
        <div className="flex flex-wrap h-full w-full p-2">
          <div className="code__description border border-red-500 w-1/2 h-full overflow-y-auto p-4">
            <h1>Hello from Code Description....</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
              autem velit sapiente. Aliquid itaque animi distinctio a dolorum
              officia quos porro! Libero itaque dolorum eius iure alias aperiam
              ullam numquam quaerat totam, perferendis harum soluta reiciendis
              consectetur blanditiis. Aut accusantium consequuntur autem, quis
              quia sint laborum eos laboriosam repudiandae necessitatibus, est
              tempora reprehenderit molestiae doloremque magni amet beatae ipsum
              cupiditate suscipit itaque recusandae voluptatem eum blanditiis
              ducimus. Doloribus expedita placeat ipsum ab aliquam. Asperiores
              quas illum nobis distinctio a eum error fugit incidunt dolores rem
              voluptatem, enim tempore soluta libero vero numquam, iusto nam,
              veniam eligendi velit aperiam quasi! Nostrum doloribus, aperiam
              nisi doloremque dignissimos iste quisquam nemo ab! Reiciendis
              optio nam officia consequuntur ducimus repellendus veritatis
              expedita maiores, itaque inventore debitis quas labore excepturi
              nesciunt amet officiis id magnam voluptas dolor iure sapiente quae
              explicabo delectus? Obcaecati explicabo provident, temporibus
              tempora incidunt corporis culpa distinctio rerum consequuntur quos
              tenetur quasi dolore minus facere blanditiis laudantium repellat!
              Laboriosam dolor culpa quis voluptate, nulla, iure animi corporis
              fugit provident distinctio necessitatibus, saepe est quo?
              Molestiae et fugit aliquam atque, consectetur explicabo libero eum
              porro natus. Deleniti dolores non ipsum in earum laborum nobis
              dolore at id repudiandae fugit reiciendis expedita molestias
              voluptatibus explicabo veritatis molestiae ducimus, natus sequi
              sed nam. Omnis eaque aliquid quis! Fugit maxime voluptates autem,
              possimus neque corrupti voluptate. Perspiciatis consequatur modi
              illo dolorem officiis laborum blanditiis dolores repellat,
              suscipit deserunt voluptates optio reiciendis, voluptate,
              temporibus enim sequi ipsa quam atque earum alias ut facilis?
              Tempore et accusantium velit, esse voluptatem unde minus, quo rem
              perferendis nostrum aliquam provident quod hic quisquam? Provident
              dolorum velit in cupiditate. Cumque labore tempora ratione porro
              neque sed asperiores iusto explicabo vitae? Voluptatem
              necessitatibus sint minus cum? Iusto unde sunt ex, nemo maxime
              quasi temporibus placeat quaerat? Voluptates cum aliquid repellat,
              sequi libero repellendus quisquam a dolor molestiae ex ea
              repudiandae, delectus sed nesciunt quos reprehenderit alias
              perferendis dolore esse, quis vel! Sunt reiciendis tenetur
              explicabo voluptates? Eligendi eius ducimus cum suscipit
              dignissimos repellat doloremque qui. Maxime at quam deserunt
              placeat molestiae sunt consectetur voluptas quasi odio provident.
              Error corrupti placeat voluptatem facilis, amet nam aut laboriosam
              consequatur quidem labore voluptatibus molestias voluptatum
              tenetur aliquam provident nihil accusantium excepturi a,
              architecto nisi, natus aspernatur odit! Commodi, odio dignissimos,
              ea delectus nihil at ab numquam quos earum sit cum asperiores
              repellendus. Exercitationem explicabo voluptatibus veniam
              obcaecati molestiae, maiores soluta quo alias recusandae numquam?
            </p>
          </div>
          <div className="code__editor border border-blue-500 flex-1 h-full relative ">
            <div className="h-[85vh] border border-red-500">
              <div className="h-full overflow-hidden">
                <Editor
                  theme="vs-dark"
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                  defaultLanguage="javascript"
                  defaultValue={`/**
                  * @param {number[]} nums
                  * @param {number} target
                  * @return {number[]}
                  */
                 var twoSum = function(nums, target) {
    
                 };`}
                />
              </div>
            </div>
            <div className="">
              <TextareaComponent />
              <div className="">
                <div className="flex justify-between ">
                  <Button>Custom Input</Button>
                  <div className="">
                    <Button className="mr-8">Run On Custom Input</Button>
                    <Button>Submit</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeEditor;
