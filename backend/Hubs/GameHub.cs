
using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.AccessControl;
using System.Security.Claims;

namespace ChatWebSignalR.Hubs
{
    [Authorize]
    public class GameHub : Hub
    {


    }
}