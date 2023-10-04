import React, { useEffect, useState } from "react";
import { Paper, Typography, CircularProgress, Divider} from "@material-ui/core";
import { useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, getPostBySearch } from '../../actions/posts'
import CommentSection from './CommentSection';
import useStyles from './styles';
import { Modal, ModalBody, ModalHeader, Row, Col } from "reactstrap";


const PostDetails = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const { id } = useParams();
  const [modal, setmodal] = useState(false);

  //main post
  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  //recomended posts
  useEffect(() => {
    if(post) {
      dispatch(getPostBySearch({ search: 'none', tags: post?.tags.join(',') }))
    }
  }, [post]);

  const openPost = (_id) => navigate(`/posts/${_id}`)


  if(!post) return null
  if(isLoading){
    return <Paper elevation={6} className={classes.loadingPaper}>
      <CircularProgress size='7em'/>
    </Paper>
  }

  // removing current post
  const recommendedPosts = posts.filter(({_id}) => _id !== post._id );

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography>
          <Divider style={{ margin: '20px 0' }} />
          <CommentSection post={post} />
          <Divider style={{ margin: '20px 0' }} />
        </div>
          <div className={classes.imageSection}>
            <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
          </div>
      </div>
      { !!recommendedPosts.length && (
        <div className={classes.section}>
        <Typography gutterBottom variant="h5">you might also like:</Typography>
        <Divider/>
        <div className={classes.recommendedPosts}>
          {recommendedPosts.map( ({title, message,name,likes,selectedFile,_id}) => (
            <div style={{ margin: '20px', cursor: "pointer" }} onClick={() => openPost(_id)} key={_id} >
              <Typography gutterBottom variant="h6">{title}</Typography>
              <Typography gutterBottom variant="subtitle2">{name}</Typography>
              <Typography gutterBottom variant="subtitle2">{message.substring(0,50)+"..."}</Typography>
              <Typography gutterBottom variant="subtitle1">Likes: {likes.length}</Typography>
              <img src={selectedFile} width="200px"/>
            </div>
          ))}
          </div>
        </div>
      )}
      <div>
        <Modal size="lg" isOpen={modal} toggle={() => setmodal(!modal)}>
          <ModalHeader toggle={() => setmodal(!modal)}>
            <h2>Report</h2>
          </ModalHeader>
          <ModalBody>
            <form>
              <Row>
                <Col lg={12} className="mb-1">
                  <div>
                    <input type="text" className="form-control" id="postname" placeholder="Post name" />
                  </div>
                </Col>
                <Col lg={12} className="mt-1 mb-1">
                  <div>
                    <input type="text" className="form-control" id="usersname" placeholder="Posted by" />
                  </div>
                </Col>
                <Col lg={12} className="mt-1 mb-1">
                  <div>
                    <input type="text" className="form-control" id="postdate" placeholder="Posted on" />
                  </div>
                </Col>
                <Col lg={24} className="mt-1">
                  <div>
                    <textarea className="form-control" id="report" placeholder="Reason for reporting" rows="5"></textarea>
                  </div>
                </Col>
              </Row>
            </form>
            <button className="px-2 rounded d-flex mx-auto mt-2" onClick={() => setmodal(false)}>Report</button>
          </ModalBody>
        </Modal>  
        <span className="">False information ? </span>
        <button className="px-2 rounded" onClick={() => setmodal(true)}>Report</button>
      </div>
    </Paper>
  );
};

export default PostDetails;
