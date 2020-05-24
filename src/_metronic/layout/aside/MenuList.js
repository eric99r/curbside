import React from "react";
import MenuSection from "./MenuSection";
import MenuItemSeparator from "./MenuItemSeparator";
import MenuItem from "./MenuItem";
import {isAdmin, isCustomer, isAuthGuard} from '../../../app/router/secure-guard';

export default class MenuList extends React.Component {
  render() {
    const { currentUrl, menuConfig, layoutConfig, user } = this.props;

    return menuConfig.aside.items.map((child, index) => {
      return (
        <>
          { isAuthGuard(child.guard, user) ?
          (<React.Fragment key={`menuList${index}`}>
            {child.section && <MenuSection item={child} />}
            {child.separator && <MenuItemSeparator item={child} />}
            {child.title && (
                <MenuItem
                    item={child}
                    currentUrl={currentUrl}
                    layoutConfig={layoutConfig}
                />
            )}
          </React.Fragment>) : ""
          }
        </>
      );
    });
  }
}
