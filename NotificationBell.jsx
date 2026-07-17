import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import API from "../api";

function NotificationBell() {

  const {
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
  } = useSocket();


  const [open, setOpen] = useState(false);
  const [, setTick] = useState(0);


  // update time every second
  useEffect(() => {

    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);


    return () => clearInterval(timer);

  }, []);



  // Mark single notification read
  const markAsRead = async (id) => {

    try {

      await API.put(`/notifications/${id}/read`);


      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                is_read: 1,
              }
            : n
        )
      );


      setUnreadCount((count) =>
        Math.max(0, count - 1)
      );


    } catch (error) {

      console.log("Mark read error:", error);

    }

  };



  // Mark all read
  const markAll = async () => {

    try {

      await API.put("/notifications/read-all");


      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: 1,
        }))
      );


      setUnreadCount(0);


    } catch(error){

      console.log("Mark all error:", error);

    }

  };



  // Delete notification
  const deleteNotification = async(id)=>{

    try{

      const deleted = notifications.find(
        (n)=>n.id===id
      );


      await API.delete(
        `/notifications/${id}`
      );


      setNotifications((prev)=>
        prev.filter(
          (n)=>n.id!==id
        )
      );


      if(
        deleted &&
        Number(deleted.is_read)===0
      ){

        setUnreadCount((count)=>
          Math.max(0,count-1)
        );

      }


    }catch(error){

      console.log(
        "Delete error:",
        error
      );

    }

  };

  // Time ago
  const getTimeAgo = (date) => {

    if (!date) return "";

    const notificationDate = new Date(date);
    const now = new Date();
    console.log("Server Time:", date);
  console.log("Browser Time:", now.toISOString());
  console.log(
    "Difference (sec):",
    Math.floor((now.getTime() - notificationDate.getTime()) / 1000)
  );

    let seconds = Math.floor(
      (now.getTime() - notificationDate.getTime()) / 1000
    );

    if (seconds < 0) seconds = 0;

    if (seconds < 60) {
      return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }

    return notificationDate.toLocaleDateString();
  };
const getNotificationIcon=(type)=>{

    switch(type){

      case "order":
        return "🛒";

      case "info":
        return "ℹ️";

      case "alert":
        return "⚠️";

      default:
        return "🔔";

    }

  };




  return (

    <div
      style={{
        position:"relative"
      }}
    >


      <button

        onClick={()=>
          setOpen(!open)
        }

        style={{

          background:"none",
          border:"none",
          fontSize:"24px",
          cursor:"pointer",
          position:"relative"

        }}

      >

        🔔


        {
          unreadCount>0 &&

          <span

            style={{

              position:"absolute",
              top:-5,
              right:-5,
              background:"red",
              color:"white",
              borderRadius:"50%",
              padding:"2px 6px",
              fontSize:"12px"

            }}

          >

            {unreadCount}

          </span>
        }


      </button>





      {
        open &&


        <div

          style={{

            position:"absolute",
            top:"45px",
            right:0,
            width:320,
            maxHeight:400,
            overflowY:"auto",
            background:"#fff",
            border:"1px solid #ddd",
            borderRadius:8,
            padding:10,
            zIndex:999,
            boxShadow:
            "0 4px 12px rgba(0,0,0,0.15)"

          }}

        >


          <div

            style={{

              display:"flex",
              justifyContent:"space-between",
              marginBottom:10

            }}

          >

            <b>
              Notifications
            </b>


            <button
              onClick={markAll}
            >
              Mark All
            </button>


          </div>





          {
            notifications.length===0 ?


            <p>
              No Notifications
            </p>


            :


            notifications
            .slice(0,10)
            .map((n)=>(


              <div

                key={n.id}


                onClick={()=>{

                  if(
                    Number(n.is_read)===0
                  ){

                    markAsRead(n.id);

                  }

                }}


                style={{

                  padding:10,
                  marginBottom:8,
                  cursor:"pointer",
                  borderRadius:6,

                  background:
                  Number(n.is_read)===1
                  ?
                  "#f7f7f7"
                  :
                  "#dff4ff"

                }}

              >


                <div

                  style={{

                    fontSize:"14px",
                    fontWeight:
                    Number(n.is_read)===0
                    ?
                    "600"
                    :
                    "400"

                  }}

                >

                  {getNotificationIcon(n.type)}
                  {" "}
                  {n.message}

                </div>



                <small

                  style={{

                    color:"#666",
                    display:"block",
                    marginTop:5

                  }}

                >

                  {getTimeAgo(n.created_at)}

                </small>




                <button

                  onClick={(e)=>{

                    e.stopPropagation();

                    deleteNotification(n.id);

                  }}


                  style={{

                    marginTop:8,
                    background:"#dc3545",
                    color:"#fff",
                    border:"none",
                    padding:"4px 8px",
                    borderRadius:4,
                    cursor:"pointer",
                    fontSize:"12px"

                  }}

                >

                  Delete

                </button>


              </div>


            ))

          }



        </div>

      }



    </div>

  );
}
export default NotificationBell;