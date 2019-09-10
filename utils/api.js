const apiAddress = {
  wx: {
    login: '/api.php?mod=Login&act=wxlogin',
    area: '/api.php?mod=Index&act=getlocation',
    upload: '/api.php?mod=Activate&act=upload'
  },
  banner: {
    list: '/api.php?mod=Index&act=banner'
  },
  user: {
    register: '/api.php?mod=Login&act=register',
    info: '/api.php?mod=User&act=userInfo',
    edit: '/api.php?mod=User&act=editInfo',
    avatar: '/api.php?mod=User&act=editHead',
    sign: '/api.php?mod=User&act=sign',
    labelList: '/api.php?mod=User&act=tagList',
    addLabel: '/api.php?mod=User&act=setTag',
    rankList: '/api.php?mod=User&act=hotList',
    dynamicList: '/api.php?mod=User&act=feedList',
    focus: '/api.php?mod=User&act=focus',
    unfocus: '/api.php?mod=User&act=unfocus',
    followList: '/api.php?mod=User&act=following',
    fansList: '/api.php?mod=User&act=follower',
    addWord: '/api.php?mod=User&act=addword',
    wordList: '/api.php?mod=User&act=wordList',
    addImpress: '/api.php?mod=User&act=addimpress',
    impressList: '/api.php?mod=User&act=impressList',
    addSupport: '/api.php?mod=User&act=addpoint',
    delSupport: '/api.php?mod=User&act=delpoint',
    mailList: '/api.php?mod=Index&act=contactList',
    changeAvatar: '/api.php?mod=User&act=editHead'
  },
  dynamic: {
    classifyList: '/api.php?mod=Activate&act=feedType',
    list: '/api.php?mod=Activate&act=feedList',
    detail: '/api.php?mod=Activate&act=feedDetail',
    support: '/api.php?mod=Activate&act=addDigg',
    opposition: '/api.php?mod=Activate&act=delDigg',
    commentList: '/api.php?mod=Activate&act=commentList',
    addComment: '/api.php?mod=Activate&act=addcomment',
    delComment: '/api.php?mod=Activate&act=delcomment',
    uploadFile: '/api.php?mod=Activate&act=upload',
    release: '/api.php?mod=Activate&act=postFeed',
    activetyList: '/api.php?mod=Activate&act=topicList',
    activetyDetail: '/api.php?mod=Activate&act=topicDetail'
  },
  classes: {
    list: '/api.php?mod=Index&act=classList',
    styleList: '/api.php?mod=Index&act=classStyle',
    styleDetail: '/api.php?mod=Index&act=styleDetail',
    memberList: '/api.php?mod=Index&act=classMember',
    memberInfo: '/api.php?mod=Index&act=userInfo',
    my: '/api.php?mod=User&act=myclass',
    types: '/api.php?mod=Index&act=classCate'
  }
}
module.exports = apiAddress