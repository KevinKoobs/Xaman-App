/**
 * Add Currency Screen
 */

import { sortBy } from 'lodash';
import React, { Component } from 'react';
import { Animated, View, Text, TouchableWithoutFeedback, ScrollView, ActivityIndicator } from 'react-native';

import Interactable from 'react-native-interactable';

import { Navigator } from '@common/helpers/navigator';
import { Toast } from '@common/helpers/interface';
import { Images } from '@common/helpers/images';
import { AppScreens } from '@common/constants';

import { AccountSchema } from '@store/schemas/latest';

import LedgerService from '@services/LedgerService';

// components
import { Button, Icon, Spacer } from '@components';

import Localize from '@locale';

// style
import { AppStyles, AppSizes, AppColors } from '@theme';
import styles from './styles';

/* types ==================================================================== */
export interface Props {
    account: AccountSchema;
}

export interface State {
    isLoading: boolean;
    accountObjects: any;
}

/* Component ==================================================================== */
class ExplainBalanceOverlay extends Component<Props, State> {
    static screenName = AppScreens.Overlay.ExplainBalance;

    panel: any;
    deltaY: Animated.Value;

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: true,
            accountObjects: undefined,
        };

        this.deltaY = new Animated.Value(AppSizes.screen.height);
    }

    componentDidMount() {
        this.loadAccountObjects();

        this.slideUp();
    }

    loadAccountObjects = () => {
        const { account } = this.props;

        LedgerService.getAccountObjects(account.address)
            .then((res: any) => {
                const { account_objects } = res;
                this.setState({
                    accountObjects: sortBy(account_objects, 'LedgerEntryType'),
                });
            })
            .catch(() => {
                Toast('Unable to load account objects');
            })
            .finally(() => {
                this.setState({
                    isLoading: false,
                });
            });
    };

    slideUp = () => {
        setTimeout(() => {
            if (this.panel) {
                this.panel.snapTo({ index: 1 });
            }
        }, 10);
    };

    slideDown = () => {
        setTimeout(() => {
            if (this.panel) {
                this.panel.snapTo({ index: 0 });
            }
        });
    };

    onSnap = (event: any) => {
        const { index } = event.nativeEvent;

        if (index === 0) {
            Navigator.dismissOverlay();
        }
    };

    renderAccountObject = (item: any) => {
        const { LedgerEntryType } = item;

        let label = LedgerEntryType;
        let icon = 'IconInfo' as Extract<keyof typeof Images, string>;

        switch (LedgerEntryType) {
            case 'RippleState':
                label = 'Trustline';
                icon = 'IconShield';
                break;
            default:
                break;
        }

        return (
            <View style={[styles.currencyItemCard]}>
                <View style={[AppStyles.row, AppStyles.centerAligned]}>
                    <View style={[styles.xrpAvatarContainer]}>
                        <Icon name={icon} size={16} style={[AppStyles.imgColorGreyDark]} />
                    </View>
                    <Text style={[styles.rowLabel]}>{label}</Text>
                </View>
                <View style={[AppStyles.flex4, AppStyles.row, AppStyles.centerAligned, AppStyles.flexEnd]}>
                    <Text style={[styles.reserveAmount]}>5 XRP</Text>
                </View>
            </View>
        );
    };

    renderReserves = () => {
        const { accountObjects, isLoading } = this.state;

        return (
            <View style={[AppStyles.paddingHorizontalSml]}>
                <View style={[styles.currencyItemCard]}>
                    <View style={[AppStyles.row, AppStyles.centerAligned]}>
                        <View style={[styles.xrpAvatarContainer]}>
                            <Icon name="IconAccount" size={15} style={[AppStyles.imgColorGreyDark]} />
                        </View>
                        <Text style={[styles.rowLabel]}>{Localize.t('account.walletReserve')}</Text>
                    </View>
                    <View style={[AppStyles.flex4, AppStyles.row, AppStyles.centerAligned, AppStyles.flexEnd]}>
                        <Text style={[styles.reserveAmount]}>20 XRP</Text>
                    </View>
                </View>

                {isLoading ? (
                    <ActivityIndicator color={AppColors.blue} />
                ) : (
                    accountObjects.map(this.renderAccountObject)
                )}

                <Spacer size={50} />
            </View>
        );
    };

    render() {
        const { account } = this.props;

        return (
            <View style={AppStyles.flex1}>
                <TouchableWithoutFeedback onPress={this.slideDown}>
                    <Animated.View
                        style={[
                            AppStyles.shadowContent,
                            {
                                opacity: this.deltaY.interpolate({
                                    inputRange: [0, AppSizes.screen.height],
                                    outputRange: [0.9, 0],
                                    extrapolateRight: 'clamp',
                                }),
                            },
                        ]}
                    />
                </TouchableWithoutFeedback>

                <Interactable.View
                    ref={(r) => {
                        this.panel = r;
                    }}
                    animatedNativeDriver
                    onSnap={this.onSnap}
                    verticalOnly
                    snapPoints={[{ y: AppSizes.screen.height + 3 }, { y: AppSizes.screen.height * 0.12 }]}
                    boundaries={{ top: AppSizes.screen.height * 0.1 }}
                    initialPosition={{ y: AppSizes.screen.height }}
                    animatedValueY={this.deltaY}
                >
                    <View style={[styles.visibleContent]}>
                        <View style={AppStyles.panelHeader}>
                            <View style={AppStyles.panelHandle} />
                        </View>

                        <View style={[AppStyles.row, AppStyles.centerAligned, AppStyles.paddingBottomSml]}>
                            <View style={[AppStyles.flex1, AppStyles.paddingLeftSml]}>
                                <Text style={[AppStyles.h5, AppStyles.strong]}>{Localize.t('global.balance')}</Text>
                            </View>
                            <View
                                style={[AppStyles.row, AppStyles.flex1, AppStyles.paddingRightSml, AppStyles.flexEnd]}
                            >
                                <Button
                                    light
                                    roundedSmall
                                    isDisabled={false}
                                    onPress={() => {
                                        this.slideDown();
                                    }}
                                    textStyle={[AppStyles.subtext, AppStyles.bold]}
                                    label={Localize.t('global.close')}
                                />
                            </View>
                        </View>
                        <View
                            style={[
                                AppStyles.row,
                                AppStyles.centerContent,
                                AppStyles.paddingBottom,
                                AppStyles.paddingHorizontalSml,
                            ]}
                        >
                            <Text style={[AppStyles.p, AppStyles.subtext, AppStyles.textCenterAligned]}>
                                {Localize.t('home.xrpYouOwnVsYourSpendableBalance')}
                            </Text>
                        </View>

                        <View style={[AppStyles.paddingHorizontalSml]}>
                            <Text style={[styles.rowTitle]}>{Localize.t('account.totalBalance')}</Text>
                            <View style={[styles.currencyItemCard]}>
                                <View style={[AppStyles.row, AppStyles.centerAligned]}>
                                    <View style={[styles.xrpAvatarContainer]}>
                                        <Icon name="IconXrp" size={20} style={[AppStyles.imgColorGreyDark]} />
                                    </View>
                                    <Text style={[styles.currencyItemLabel, AppStyles.colorGreyDark]}>XRP</Text>
                                </View>
                                <View
                                    style={[AppStyles.flex4, AppStyles.row, AppStyles.centerAligned, AppStyles.flexEnd]}
                                >
                                    <Text style={[AppStyles.h5, AppStyles.monoBold, AppStyles.colorGreyDark]}>
                                        {account.balance}
                                    </Text>
                                </View>
                            </View>

                            <Spacer size={30} />

                            <Text style={[styles.rowTitle]}>{Localize.t('global.spendable')}</Text>
                            <View style={[styles.currencyItemCard]}>
                                <View style={[AppStyles.row, AppStyles.centerAligned]}>
                                    <View style={[styles.xrpAvatarContainer]}>
                                        <Icon name="IconXrp" size={20} />
                                    </View>
                                    <Text style={[styles.currencyItemLabel]}>XRP</Text>
                                </View>
                                <View
                                    style={[AppStyles.flex4, AppStyles.row, AppStyles.centerAligned, AppStyles.flexEnd]}
                                >
                                    <Text style={[AppStyles.h5, AppStyles.monoBold]}>{account.availableBalance}</Text>
                                </View>
                            </View>
                            <Spacer size={30} />
                            <Text style={[styles.rowTitle]}>{Localize.t('global.reserved')}</Text>
                            <Spacer size={10} />
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={16}
                            bounces={false}
                            contentContainerStyle={[AppStyles.stretchSelf]}
                        >
                            {this.renderReserves()}
                        </ScrollView>
                    </View>
                </Interactable.View>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default ExplainBalanceOverlay;
