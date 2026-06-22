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
            user.ProfileImageId);
    }

    public async Task<(UserProfileRo? profile, IdentityResult? result)> UpdateProfileAsync(
        string userId,
        UpdateUserProfileDto request,
        CancellationToken ct)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return (null, null);


        user.FirstName = request.FirstName.Trim();
        user.LastName = request.LastName.Trim();

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return (null, updateResult);

        return (new UserProfileRo(
            user.Email ?? string.Empty,
            user.FirstName,
            user.LastName,
            user.ProfileImageId),
            updateResult);
    }

    public async Task<(UserProfileRo? profile, IdentityResult? result)> UpdateProfileImageAsync(
        string userId,
        Guid imageId,
        CancellationToken ct)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return (null, null);

        user.ProfileImageId = imageId;
        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return (null, updateResult);

        return (new UserProfileRo(
            user.Email ?? string.Empty,
            user.FirstName,
            user.LastName,
            user.ProfileImageId),
            updateResult);
    }

    public async Task<(UserProfileRo? profile, IdentityResult? result)> ClearProfileImageAsync(
        string userId,
        CancellationToken ct)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return (null, null);

        user.ProfileImageId = null;
        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return (null, updateResult);

        return (new UserProfileRo(
            user.Email ?? string.Empty,
            user.FirstName,
            user.LastName,
            user.ProfileImageId),
            updateResult);
    }
}
