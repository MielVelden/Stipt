using Backend.Database.Entities;
using Backend.Web.Features.Users.Dtos;
using Microsoft.AspNetCore.Identity;

namespace Backend.Web.Features.Users;

public sealed class UsersService(UserManager<ApplicationUser> userManager)
{
    public async Task<UserProfileRo?> GetProfileAsync(string userId, CancellationToken ct)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return null;

        return new UserProfileRo(
            user.Email ?? string.Empty,
            user.FirstName,
            user.LastName,
            user.PhoneNumber ?? string.Empty);
    }

    public async Task<(UserProfileRo? profile, IdentityResult? result)> UpdateProfileAsync(
        string userId,
        UpdateUserProfileDto request,
        CancellationToken ct)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return (null, null);

        if (!string.Equals(user.Email, request.Email, StringComparison.OrdinalIgnoreCase))
        {
            var setEmailResult = await userManager.SetEmailAsync(user, request.Email);
            if (!setEmailResult.Succeeded)
                return (null, setEmailResult);

            var setUserNameResult = await userManager.SetUserNameAsync(user, request.Email);
            if (!setUserNameResult.Succeeded)
                return (null, setUserNameResult);
        }

        user.FirstName = request.FirstName.Trim();
        user.LastName = request.LastName.Trim();
        user.PhoneNumber = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return (null, updateResult);

        return (new UserProfileRo(
            user.Email ?? string.Empty,
            user.FirstName,
            user.LastName,
            user.PhoneNumber ?? string.Empty),
            updateResult);
    }
}

