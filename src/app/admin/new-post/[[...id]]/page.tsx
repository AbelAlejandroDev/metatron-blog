"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useForm, SubmitHandler } from "react-hook-form";

import InputText from "@/components/InputText";
import TextArea from "@/components/TextArea";
import Card from "@/components/Card";
import CardBody from "@/components/CardBody";
import Button from "@/components/Button";
import Breadcrumbs from "@/components/Breadcrumbs";

import Section from "@/app/admin/_components/Section";

import { Post } from "@/types/Post";
import { toast } from "sonner";
import { show, store, update } from "@/services/posts";

type PostInputs = {
  title: string;
  description: string;
  content: string;
};

export default function NewPost({ params }: { params: { id?: string[] } }) {
  const [isLoading, setLoading] = useState(false);
  const [post, setPost] = useState<Post>({
    userId: "1",
    title: "",
    description: "",
    date: "",
    image: "",
    isFeatured: false,
    content: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostInputs>();

  const onSubmit: SubmitHandler<PostInputs> = async (data) => {
    setLoading(true);

    const post = {
      id: String(params?.id) ?? "",
      date: String(new Date().getUTCDate()),
      userId: "1",
      image: "",
      isFeatured: false,
      ...data,
    };

    try {
      params?.id && params.id[0]
        ? await updatePost(post)
        : await storePost(post);
    } catch (error) {
      toast.error((error as Error).message);
      console.log(error);
    }

    setLoading(false);
  };

  const router = useRouter();

  useEffect(() => {
    if (!params.id) return;

    const loadPost = async () => {
      setPost(await show(String(params.id)));
    };

    loadPost();
  }, [params.id]);

  const storePost = async (post: Post) => {
    await store(post);
    router.push("/admin/posts");
    toast.success("Post inserted successfully");
  };

  const updatePost = async (post: Post) => {
    await update(post);
    toast.success("Post updated successfully");
  };

  return (
    <Section width="max-w-2xl">
      <Breadcrumbs
        className="my-5"
        breadcrumbs={[
          {
            href: "/admin/posts",
            text: "Posts",
          },
          {
            href: "/admin/new-post",
            text: "New Post",
          },
        ]}
      ></Breadcrumbs>

      <h2 className="text-3xl mb-2">Make new post</h2>
      <Card>
        <CardBody>
          {isLoading && <p>Loading baby</p>}

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputText
              label="Title"
              defaultValue={post?.title ?? ""}
              required="The title is required"
              register={register}
              error={errors.title}
            ></InputText>
            <TextArea
              label="Description"
              required="The description is required"
              defaultValue={post.description ?? ""}
              register={register}
              minLength={{
                value: 40,
                message: "At least 40 characters are required",
              }}
              maxLength={{
                value: 120,
                message: "A maximum of 120 characters is allowed",
              }}
              error={errors.description}
            ></TextArea>
            <TextArea
              label="Content"
              required="The content is required"
              defaultValue={post.content ?? ""}
              register={register}
              minLength={{
                value: 200,
                message: "At least 200 characters are required",
              }}
              error={errors.content}
            ></TextArea>
            <Button className="ml-auto" loading={isLoading}>
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </Section>
  );
}
