"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Activity, Ban, Filter, Gamepad2, ShieldBan, ShieldCheck, Trash2, Users, X } from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { useTranslation } from "@/hooks/useSetting";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { toErrorCode, useErrorMessage } from "@/hooks/useErrorMessage";
import { userService } from "@/services/def/UserService";
import { GPage } from "@/component/common/GPage";
import { GPageHeader } from "@/component/common/GPageHeader";
import { GAsync } from "@/component/common/GAsync";
import { GAlert } from "@/component/common/GAlert";
import { GBadge } from "@/component/common/GBadge";
import { GButton } from "@/component/common/GButton";
import { GConfirmDialog } from "@/component/common/GConfirmDialog";
import { GSelect } from "@/component/common/GSelect";
import { GSearchField } from "@/component/common/GSearchField";
import { GSectionHeader } from "@/component/common/GSectionHeader";
import { FriendsList } from "@/component/social/FriendsList";
import { StatCard } from "@/component/profile/StatCard";
import { GIcon } from "@/component/common/GIcon";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { UserRoleEnum } from "@/domain/enum/UserRoleEnum";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";

import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en } from "./i18n/en.i18n";

import type { TAdminTranslation } from "./i18n/en.i18n";
import type { IAdminStats } from "@/domain/meta/IAdminStats";
import type { IAdminUser } from "@/domain/meta/IAdminUser";
import type { TNullable } from "@/domain/type/TCommon";

type TRoleOption = Exclude<UserRoleEnum, UserRoleEnum.All>;

const roleLabelKey: Record<TRoleOption, "roleUser" | "roleModerator" | "roleAdmin" | "roleSuperAdmin"> = {
  [UserRoleEnum.User]: "roleUser",
  [UserRoleEnum.Moderator]: "roleModerator",
  [UserRoleEnum.Admin]: "roleAdmin",
  [UserRoleEnum.SuperAdmin]: "roleSuperAdmin",
};

function displayNameOf(user: IAdminUser): string {
  return user.fullName || user.userName || user.email || user.id;
}

function AdminPage() {
  const t = useTranslation<TAdminTranslation>({ en, ar, fr });
  const resolveError = useErrorMessage();
  const { user: currentUser } = useAuth();
  const canManageRoles = currentUser?.role === UserRoleEnum.Admin || currentUser?.role === UserRoleEnum.SuperAdmin;
  const isSuperAdmin = currentUser?.role === UserRoleEnum.SuperAdmin;

  const [stats, setStats] = useState<TNullable<IAdminStats>>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<TNullable<string>>(null);
  const [statsReloadKey, setStatsReloadKey] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(UserStatusEnum.All);
  const [roleFilter, setRoleFilter] = useState(UserRoleEnum.All);
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<TNullable<string>>(null);
  const [feedback, setFeedback] = useState<TNullable<{ text: string; severity: "success" | "danger" }>>(null);
  const [pendingBan, setPendingBan] = useState<TNullable<IAdminUser>>(null);
  const [pendingDelete, setPendingDelete] = useState<TNullable<IAdminUser>>(null);
  const [pendingRole, setPendingRole] = useState<TNullable<{ user: IAdminUser; role: TRoleOption }>>(null);
  const [usersReloadKey, setUsersReloadKey] = useState(0);

  const debouncedSearch = useDebouncedValue(search.trim(), 500);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const load = async () => {
      if (!ignore) setStatsLoading(true);
      try {
        const res = await userService.getStats({ signal: controller.signal });
        if (!ignore && res.data) {
          setStats(res.data);
          setStatsError(null);
        }
      } catch (e: unknown) {
        if (axios.isCancel(e)) return;
        if (!ignore) setStatsError(resolveError(toErrorCode(e), t.error.title));
      } finally {
        if (!ignore) setStatsLoading(false);
      }
    };

    void load();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [statsReloadKey, resolveError, t.error.title]);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const load = async () => {
      if (!ignore) {
        setUsersLoading(true);
        setFeedback(null);
      }
      try {
        const res = await userService.getUsersByAdmin(
          {
            name: debouncedSearch,
            userStatus: statusFilter,
            userRole: roleFilter,
          },
          { signal: controller.signal },
        );
        if (!ignore) {
          setUsers(res.data ?? []);
          setUsersError(null);
        }
      } catch (e: unknown) {
        if (axios.isCancel(e)) return;
        if (!ignore) {
          setUsers([]);
          setUsersError(resolveError(toErrorCode(e), t.error.title));
        }
      } finally {
        if (!ignore) setUsersLoading(false);
      }
    };

    void load();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [debouncedSearch, statusFilter, roleFilter, usersReloadKey, resolveError, t.error.title]);

  const runAction = async (action: () => Promise<unknown>, success: string) => {
    setFeedback(null);
    try {
      await action();
      setFeedback({ text: success, severity: "success" });
      setUsersReloadKey((k) => k + 1);
    } catch (e: unknown) {
      setFeedback({ text: resolveError(toErrorCode(e)), severity: "danger" });
    }
  };

  const handleBanConfirm = async () => {
    if (!pendingBan) return;
    const target = pendingBan;
    setPendingBan(null);
    await runAction(() => userService.banUser(target.id), t.feedbackBanned);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    await runAction(() => userService.deleteUser(target.id), t.feedbackDeleted);
  };

  const handleRoleConfirm = async () => {
    if (!pendingRole) return;
    const { user, role } = pendingRole;
    setPendingRole(null);
    await runAction(() => userService.setRole(user.id, role), t.feedbackRoleUpdated);
  };

  const canModerate = (user: IAdminUser) => !!currentUser && user.id !== currentUser.id && user.role < currentUser.role;

  const clearSearch = () => setSearch("");

  return (
    <GPage size={SizeEnum.lg}>
      <GPageHeader icon={ShieldCheck} title={t.title} subtitle={t.subtitle} className="hidden md:block" />

      <GAsync
        loading={statsLoading}
        error={statsError}
        errorTitle={t.error.title}
        retryLabel={t.error.retry}
        onRetry={() => setStatsReloadKey((k) => k + 1)}
        spinnerSize={SizeEnum.lg}
        className="py-10">
        {stats && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={Users} label={t.statsTotal} value={stats.totalUsers} />
            <StatCard icon={Activity} label={t.statsOnline} value={stats.onlineUsers} />
            <StatCard icon={Gamepad2} label={t.statsInGame} value={stats.inGameUsers} />
            <StatCard icon={ShieldBan} label={t.statsBanned} value={stats.bannedUsers} />
          </div>
        )}
      </GAsync>

      <GSectionHeader icon={Users} title={t.usersTitle} className="mt-8" />

      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <GSearchField
          id="admin-user-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="flex-1"
          endIcon={
            search && (
              <GButton
                type="button"
                icon={X}
                label={t.clearSearch}
                variant={ButtonVariantEnum.Subtle}
                size={SizeEnum.xs}
                onClick={clearSearch}
                className="p-0 text-text-muted hover:text-text"
              />
            )
          }
        />
        <GSelect
          startIcon={<GIcon icon={Filter} size={SizeEnum.sm} color={AccentColorEnum.Muted} />}
          value={statusFilter}
          onChange={(e) => setStatusFilter(Number(e.target.value) as UserStatusEnum)}
          options={[
            { value: UserStatusEnum.All, label: t.allStatuses },
            { value: UserStatusEnum.Online, label: t.online },
            { value: UserStatusEnum.Offline, label: t.offline },
            { value: UserStatusEnum.InGame, label: t.inGame },
          ]}
        />
        <GSelect
          value={roleFilter}
          onChange={(e) => setRoleFilter(Number(e.target.value) as UserRoleEnum)}
          options={[
            { value: UserRoleEnum.All, label: t.allRoles },
            { value: UserRoleEnum.User, label: t.roleUser },
            { value: UserRoleEnum.Moderator, label: t.roleModerator },
            { value: UserRoleEnum.Admin, label: t.roleAdmin },
            { value: UserRoleEnum.SuperAdmin, label: t.roleSuperAdmin },
          ]}
        />
      </div>

      {feedback && (
        <GAlert severity={feedback.severity === "success" ? AccentColorEnum.Success : AccentColorEnum.Danger} className="mb-4">
          {feedback.text}
        </GAlert>
      )}

      <GAsync
        loading={usersLoading}
        error={usersError}
        errorTitle={t.error.title}
        retryLabel={t.error.retry}
        onRetry={() => setUsersReloadKey((k) => k + 1)}
        spinnerSize={SizeEnum.lg}
        className="py-10">
        <FriendsList
          friends={users}
          query={debouncedSearch || undefined}
          emptyMessage={t.noResultsTitle}
          emptyDescription={t.noResultsDesc}
          actions={(user) => (
            <div className="flex items-center gap-1">
              {user.isBanned && <GBadge variant={AccentColorEnum.Danger}>{t.bannedBadge}</GBadge>}
              {user.role !== UserRoleEnum.User && user.role !== UserRoleEnum.All && <GBadge>{t[roleLabelKey[user.role]]}</GBadge>}
              {canModerate(user) &&
                (user.isBanned ? (
                  <GButton
                    icon={ShieldCheck}
                    label={t.unban}
                    tone="success"
                    onClick={() => runAction(() => userService.unbanUser(user.id), t.feedbackUnbanned)}
                  />
                ) : (
                  <GButton icon={Ban} label={t.ban} tone="danger" onClick={() => setPendingBan(user)} />
                ))}
              {canManageRoles && canModerate(user) && (
                <>
                  <GButton icon={Trash2} label={t.delete} tone="danger" onClick={() => setPendingDelete(user)} />
                  <GSelect
                    aria-label={t.changeRole}
                    value={user.role}
                    className="w-32"
                    onChange={(e) => setPendingRole({ user, role: Number(e.target.value) as TRoleOption })}
                    options={[
                      { value: UserRoleEnum.User, label: t.roleUser },
                      { value: UserRoleEnum.Moderator, label: t.roleModerator },
                      ...(isSuperAdmin
                        ? [
                            { value: UserRoleEnum.Admin, label: t.roleAdmin },
                            { value: UserRoleEnum.SuperAdmin, label: t.roleSuperAdmin },
                          ]
                        : []),
                    ]}
                  />
                </>
              )}
            </div>
          )}
        />
      </GAsync>

      <GConfirmDialog
        open={pendingBan !== null}
        icon={Ban}
        iconColor={AccentColorEnum.Danger}
        title={t.confirmBanTitle}
        description={pendingBan ? t.confirmBanDesc.replace("{{name}}", displayNameOf(pendingBan)) : ""}
        confirmLabel={t.confirm}
        cancelLabel={t.cancel}
        onClose={() => setPendingBan(null)}
        onConfirm={() => handleBanConfirm()}
      />

      <GConfirmDialog
        open={pendingDelete !== null}
        icon={Trash2}
        iconColor={AccentColorEnum.Danger}
        title={t.confirmDeleteTitle}
        description={pendingDelete ? t.confirmDeleteDesc.replace("{{name}}", displayNameOf(pendingDelete)) : ""}
        confirmLabel={t.confirm}
        cancelLabel={t.cancel}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => handleDeleteConfirm()}
      />

      <GConfirmDialog
        open={pendingRole !== null}
        icon={ShieldCheck}
        iconColor={AccentColorEnum.Primary}
        title={t.confirmRoleTitle}
        description={
          pendingRole
            ? t.confirmRoleDesc.replace("{{name}}", displayNameOf(pendingRole.user)).replace("{{role}}", t[roleLabelKey[pendingRole.role]])
            : ""
        }
        confirmLabel={t.confirm}
        cancelLabel={t.cancel}
        confirmVariant={ButtonVariantEnum.Primary}
        onClose={() => setPendingRole(null)}
        onConfirm={() => handleRoleConfirm()}
      />
    </GPage>
  );
}

export default AdminPage;
