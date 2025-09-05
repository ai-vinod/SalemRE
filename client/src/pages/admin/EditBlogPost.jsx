import React from 'react';
import { useParams } from 'react-router-dom';
import BlogEditor from './BlogEditor';

const EditBlogPost = () => {
  const { id } = useParams();
  return <BlogEditor isEditMode={true} postId={id} />;
};

export default EditBlogPost;